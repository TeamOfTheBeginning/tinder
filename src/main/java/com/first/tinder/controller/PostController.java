package com.first.tinder.controller;

import com.first.tinder.dto.Paging;

import com.first.tinder.entity.Images;
import com.first.tinder.entity.Post;
import com.first.tinder.entity.PostLikes;
import com.first.tinder.service.PostService;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    PostService ps;

    @Autowired
    ServletContext context;

    @PostMapping("/fileupload")
    public HashMap<String, Object> fileupload( @RequestParam("image") MultipartFile file ) {
        HashMap<String, Object> result = new HashMap<>();
        String path = context.getRealPath("/userimg");
        Calendar today = Calendar.getInstance();
        long dt = today.getTimeInMillis();
        String filename = file.getOriginalFilename();
        String fn1 = filename.substring(0, filename.indexOf(".") );
        String fn2 = filename.substring(filename.indexOf(".") );
        String uploadPath = path + "/" + fn1 + dt + fn2;
        try {
            file.transferTo( new File(uploadPath) );
            result.put("filename", fn1 + dt + fn2);
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
        }
        System.out.print(result);
        return result;
    }


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
        result.put("paging", paging);
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
}
