package com.first.tinder.controller;

import com.first.tinder.dto.Paging;

import com.first.tinder.entity.Ads;
import com.first.tinder.entity.Images;
import com.first.tinder.entity.Post;
import com.first.tinder.entity.PostLikes;
import com.first.tinder.service.PostService;
import com.first.tinder.service.S3UploadService;
import jakarta.servlet.ServletContext;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    PostService ps;

    @Autowired
    ServletContext context;

//    @PostMapping("/fileupload")
//    public HashMap<String, Object> fileupload( @RequestParam("image") MultipartFile file ) {
//        HashMap<String, Object> result = new HashMap<>();
//        String path = context.getRealPath("/userimg");
//        Calendar today = Calendar.getInstance();
//        long dt = today.getTimeInMillis();
//        String filename = file.getOriginalFilename();
//        String fn1 = filename.substring(0, filename.indexOf(".") );
//        String fn2 = filename.substring(filename.indexOf(".") );
//        String uploadPath = path + "/" + fn1 + dt + fn2;
//        try {
//            file.transferTo( new File(uploadPath) );
//            result.put("filename", fn1 + dt + fn2);
//        } catch (IllegalStateException | IOException e) {
//            e.printStackTrace();
//        }
//        System.out.print(result);
//        return result;
//    }

    @PostMapping("/fileupload")
    public HashMap<String, Object> fileupload(@RequestParam("file") MultipartFile file) throws IOException, InterruptedException {
        HashMap<String, Object> result = new HashMap<>();
        String path = "/home/dhk/tinder/src/main/webapp/userimg";

        // ✅ 원본 파일명에서 확장자 유지
        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains(".")) ?
                FilenameUtils.getExtension(originalFilename) : "jpg"; // 기본 확장자 설정
        String filename = UUID.randomUUID().toString() + "." + extension;
        String uploadPath = path + "/" + filename;

        System.out.println("Uploading file: " + originalFilename + " -> Saved as: " + filename);

        if (file.getContentType().startsWith("image")) {
            // Thumbnailator로 이미지 리사이징
            BufferedImage originalImage = ImageIO.read(file.getInputStream());
            BufferedImage resizedImage = Thumbnails.of(originalImage)
                    .size(800, 800)
                    .outputQuality(0.8)
                    .asBufferedImage();
            ImageIO.write(resizedImage, "jpg", new File(uploadPath));
        } else if (file.getContentType().startsWith("video")) {
            // 동영상 파일을 그대로 저장
            file.transferTo(new File(uploadPath));
        }

        result.put("filename", filename);
        return result;
    }

    //아마존 업로드
//    @Autowired
//    S3UploadService sus;
//
//    @PostMapping("/fileupload")
//    public HashMap<String, Object> fileupload( @RequestParam("file") MultipartFile file){
//
//        HashMap<String, Object> result = new HashMap<String, Object>();
//        System.out.println("file"+file);
//        String originalfilename = file.getOriginalFilename();
//
//        try {
//            String uploadFilePathName =sus.saveFile(file);
//            System.out.println("originalfilename"+originalfilename);
//            System.out.println("uploadFilePathName"+uploadFilePathName);
//            result.put("originalfilename", originalfilename);
//            result.put("filename",uploadFilePathName);
//        } catch (IllegalStateException | IOException e) {
//            e.printStackTrace();
//        }
//        return result;
//    }


    @PostMapping("/writePost")
    public HashMap<String,Object> writePost(@RequestBody Post post) {
        HashMap<String,Object> result = new HashMap<>();
        Post p = ps.insertPost(post);
        result.put("postid", p.getPostId() );
        result.put("msg", "ok");
        return result;
    }

    @PostMapping("/writeImages")
    public HashMap<String,Object> writeImages(@RequestBody HashMap<String, Object> request) {
        HashMap<String,Object> result = new HashMap<>();

        // 요청 데이터에서 postId 및 savefileName 추출
        int postId = (int) request.get("postId");
        String savefileName = (String) request.get("savefileName");

        // ✅ postId를 이용하여 Post 객체 조회
        Post post = ps.getPostByPostId(postId);
        if (post == null) {
            result.put("error", "Post not found");
            return result;
        }

        // ✅ Post 객체를 설정하여 Images 엔티티 생성
        Images images = new Images();
        images.setPost(post);
        images.setSavefileName(savefileName);

        // ✅ DB 저장
        ps.insertImage(images);

        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/getPostList")
    public HashMap<String,Object> getPostList(
            @RequestParam("word") String word, @RequestParam("page") int page ) {
        System.out.println("getPostList@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        HashMap<String,Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage( page );
        paging.calPaging();
        result.put("postList2", ps.getPostList2( word, paging ) );
        System.out.println("postList2"+ps.getPostList2( word, paging ));
//        result.put("paging", paging);
        return result;
    }

    @GetMapping("/getPostOneWithin3daysOrderByRand")
    public HashMap<String,Object> getPostOneWithin3daysOrderByRand(
                ){
        HashMap<String,Object> result = new HashMap<>();

        Post postOne = ps.getPostOneWithin3daysOrderByRand();
        System.out.println("postOne"+postOne.getPostId());
        result.put("postOne",postOne);
        return result;
    }

    @GetMapping("/getImages/{postId}")
    public HashMap<String,Object> getImages(@PathVariable("postId") int postId) {
        HashMap<String,Object> result = new HashMap<>();

        Post post = ps.getPostByPostId(postId);

        result.put("imgList", ps.getImagesList( post ) );
        System.out.println("ps.getImagesList( post )"+ps.getImagesList( post ));
        return result;
    }


    @GetMapping("/getLikeList/{postId}")
    public HashMap<String,Object> getLikeList(@PathVariable("postId") int postId) {
        HashMap<String,Object> result = new HashMap<>();
        result.put("likeList", ps.getLikeList( postId ) );
        return result;
    }


    @PostMapping("/addLike")
    public HashMap<String,Object> addLike(
            @RequestParam("postId") int postId,
            @RequestParam("memberId") int memberId
    ) {
        System.out.println("addLike postId : "+postId+" addLike memberId: "+memberId);
        HashMap<String,Object> result = new HashMap<>();
        ps.insertLikes(postId,memberId);
        result.put("msg", "ok");
        return result;
    }



    @GetMapping("/getReplyList/{postId}")
    public HashMap<String,Object> getReplyList(@PathVariable("postId") int postId) {
        HashMap<String,Object> result = new HashMap<>();
        result.put("replyList2", ps.getReplyList2( postId ) );
//        result.put("replyList", ps.getReplyList( postId ) );
        return result;
    }


    @PostMapping("/addReply")
    public HashMap<String,Object> addReply
            (
                    @RequestParam("postId") int  postId,
                    @RequestParam("memberId") int  memberId,
                    @RequestParam("content") String  content
            ) {
        HashMap<String,Object> result = new HashMap<>();
        ps.addReply(postId,memberId,content);
        result.put("msg", "ok");
        return result;
    }

    @DeleteMapping("/deleteReply/{replyId}")
    public HashMap<String,Object> deleteReply(@PathVariable("replyId") int replyId) {
        HashMap<String,Object> result = new HashMap<>();
        ps.deleteReply( replyId );
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/getAd")
    public HashMap<String,Object> getAd(){
        HashMap<String,Object> result = new HashMap<>();
        Ads ads = ps.getRandomAdAndIncrementCount();
        result.put("ads", ads);
        return result;
    }

}
