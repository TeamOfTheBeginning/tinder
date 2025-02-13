package com.first.tinder.service;

import com.first.tinder.dao.*;
import com.first.tinder.dto.Paging;
import com.first.tinder.entity.*;
import com.first.tinder.service.dao.PostDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class PostService {

    @Autowired
    PostRepository pr;
    @Autowired
    HashtagRepository hr;
    @Autowired
    PosthashRepository phr;
    @Autowired
    MemberRepository mr;
    @Autowired
    NotificationRepository nr;
    @Autowired
    SseEmitterService ses;

    public Post insertPost(Post post) {
        Optional<Member> member = mr.findById( post.getWriter() );
        if (member.isPresent()) post.setMember( member.get() );
        Post p = pr.save(post);
        int postId = p.getPostId();  // 방금 추가된 레코드의  id 저장
        return p;
    }

//    public List<Post> getPostList(String word) {
//        List<Post> list=null;
//        if( word==null || word.equals("") ) {
//            System.out.println("service : getPostList");
//            list = pr.findAll(Sort.by(Sort.Direction.DESC, "id"));
//        }else{
//            // word로 hashtag 테이블 검색
//            // select id from hashtag where word=?
//
//            // 검색결과에 있는 tagid 들로  posthash테이블에서 postid 들을 검색
//            // select postid from posthash where hashid=?
//
//            // postid 들로 post 테이블에서  post 들을 검색
//            // select * from post where id=?
//
//            Optional<Hashtag> record = hr.findByWord(word);  // word 를 hasgtag 테이블에서 검색
//            if( !record.isPresent() ) {
//                list = pr.findAll(Sort.by(Sort.Direction.DESC, "id"));  // 검색 결과가 없으면 모두 검색
//            }else{
//                // hashtag 테이블의 id : record.get().getId()
//                List<PostHash> phList = phr.findByHashid(  record.get().getPostHashId() );   // hashid로 PostHash 테이블 검색
//
//                List<Integer> poistidList = new ArrayList<>();
//                for( PostHash ph : phList ) {    // PostHash 들에서 postid 만 추출해서 List(poistidList) 로 재구성
//                    poistidList.add( ph.getPostid() );
//                }
//
//                list = pr.findByIdIn( poistidList );  // poistidList 로 Post 테이블 검색
//            }
//        }
//        return list;
//    }

    @Autowired
    ImagesRepository ir;

    public void insertImage(Images images) {
        ir.save(images) ; }

    public List<Images> getImagesList(Post post) {
        List<Images> list = ir.findByPost( post );
        return list;
    }

    @Autowired
    PostLikesRepository plr;

    public List<PostLikes> getLikeList(int postId) {

        Post post = pr.findById(postId).get();

        List<PostLikes> list = plr.findByPost( post );
        return list;
    }

    public void insertLikes(int postId, int memberId) {
        Post post = pr.findById(postId).get();
        Member member = mr.findById(memberId).get();

        Optional<PostLikes> recored = plr.findByPostAndMember(post, member);
        if( recored.isPresent() ) {
            System.out.println("deletelikes : "+recored);
            plr.delete( recored.get() );
            System.out.println("좋아요가 삭제되었습니다.");
        }else{
            PostLikes addlikes = new PostLikes();
            addlikes.setPost( post );
            addlikes.setMember( member );
            plr.save( addlikes );
            System.out.println("addlikes : " + addlikes);
            System.out.println("좋아요가 추가되었습니다.");

            int liked = post.getMember().getMemberId();

            // ✅ Notification 생성 & 저장
            Member likedMember = mr.findById(liked).orElseThrow();
            Member likerMember = mr.findById(memberId).orElseThrow();

            Notification notification = new Notification();
            notification.setMember(likedMember); // 알림을 받을 사용자
            notification.setMessagefrom(likerMember.getNickname()); // 좋아요 누른 사용자 이름
            notification.setMessage(likerMember.getNickname() + "님이 회원님의 "+ postId + "번 포스트를 좋아합니다.");
            notification.setReadOnNot(0);

            Notification afternotification = nr.save(notification); // 저장

            // ✅ SSE 알림 전송
            ses.sendNotification(liked, notification.getMessage(),afternotification);


        }
    }


    @Autowired
    ReplyRepository rr;

    public List<Reply> getReplyList2(int postId) {

        Post post = pr.findById(postId).get();

        return rr.findByPostOrderByReplyIdDesc( post );
    }

    public void addReply(int postId, int memberId, String content) {

        Post post = pr.findById(postId).get();
        Member member = mr.findById(memberId).get();

        Reply reply = new Reply();
        reply.setPost( post );
        reply.setMember( member );
        reply.setContent( content );

        rr.save(reply);

        int liked = post.getMember().getMemberId();

        // ✅ Notification 생성 & 저장
        Member likedMember = mr.findById(liked).orElseThrow();
        Member likerMember = mr.findById(memberId).orElseThrow();

        Notification notification = new Notification();
        notification.setMember(likedMember); // 알림을 받을 사용자
        notification.setMessagefrom(likerMember.getNickname()); // 좋아요 누른 사용자 이름
        notification.setMessage(likerMember.getNickname() + "님이 회원님의 "+ postId + "번 포스트에 댓글을 작성했습니다.");
        notification.setReadOnNot(0);

        Notification afternotification = nr.save(notification); // 저장
        System.out.println("afternotification"+afternotification);

        // ✅ SSE 알림 전송
        ses.sendNotification(liked, notification.getMessage(), afternotification);
    }

    public void deleteReply(int replyId) {
        Optional<Reply> rep = rr.findByReplyId(replyId);
        if( rep.isPresent() ) {
            rr.delete( rep.get() );
        }
    }

    @Autowired
    PostDao pdao;

    public List<Post> getPostList2( String word , Paging paging ) {
        List<Post> list = null;

        if( word == null || word.equals("") ) {
            // 검색어가 비어있으면 모두 검색
            list = pdao.getPostListByPaging( paging.getStartNum(), paging.getDisplayRow() );
        }else{
            Optional<Hashtag> hashtag = hr.findByWord(word);  // word 를 hasgtag 테이블에서 검색

            if( !hashtag.isPresent() ) {
                // 검색하려는 단어가 한번도 등록된적이 없으면 모두검색
                list = pr.findAll(Sort.by(Sort.Direction.DESC, "postId"));  // 검색 결과가 없으면 모두 검색
            }else{
                // 검색하려는 단어가 hashag 테이블에 있는 단어라면
                // List<PostHash> phList = phr.findByHashid(  record.get().getId() );
                list = pdao.getPostListByTagByPage( hashtag.get().getHashtagId(), paging.getStartNum(), paging.getDisplayRow()  );
            }
        }
        return list;
    }

    public Post getPostByPostId(int postid) {
        return pr.findByPostId(postid);
    }





}











