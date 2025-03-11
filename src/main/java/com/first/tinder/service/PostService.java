package com.first.tinder.service;

import com.first.tinder.dao.*;
import com.first.tinder.dto.Paging;
import com.first.tinder.entity.*;
import com.first.tinder.service.dao.PostDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;
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
    PosthashtagRepository phr;
    @Autowired
    PostMentionRepository pmr;
    @Autowired
    MemberRepository mr;
    @Autowired
    NotificationRepository nr;
    @Autowired
    SseEmitterService ses;
    @Autowired
    AdRepository ar;

    public Post insertPost(Post post) {
    Optional<Member> member = mr.findById(post.getMember().getMemberId());
    if (member.isPresent()) post.setMember(member.get());
    Post p = pr.save(post);
    int postId = p.getPostId();

        //  추가된 포스트의 content 추출
        String content = p.getContent();

        // content 에서 해시태그들만 추출
        Matcher m = Pattern.compile("#([0-9a-zA-Z가-힣]*)").matcher(content);
        List<String> tags = new ArrayList<String>();
        while (m.find()) {
            //System.out.println(m.group(1));
            tags.add(m.group(1));
        }

        // 추출된 해시테그들로 해시테그 작업
        Hashtag hashtag = null;
        for( String tag : tags ) {
            // tag 변수로 Hasgtag테이블 검색
            Optional<Hashtag> record = hr.findByWord(tag);
            // 있으면 아이디만 추출
            if( record.isPresent() ) hashtag = record.get();
                // 현재 워드가 없으면  hashtag 테이블에 새레코드 추가하고 아이디 추출
            else{
                Hashtag htnew = new Hashtag();
                htnew.setWord(tag);
                Hashtag htsave = hr.save(htnew);
                hashtag = htsave;
            }
            // 추출된 포스트와  해쉬테그로 posthashtag 테이블에 레코드 추가
            PostHashtag pht = new PostHashtag();
            pht.setPost( p );
            pht.setHashtag( hashtag );
            phr.save(pht);
        }

        // content 에서 멘션들만 추출
        Matcher m1 = Pattern.compile("@([0-9a-zA-Z가-힣]*)").matcher(content);
        List<String> mentions = new ArrayList<String>();
        while (m1.find()) {
            //System.out.println(m.group(1));
            mentions.add(m1.group(1));
        }

        // 추출된 해시테그들로 해시테그 작업
//        PostMention postMention = null;
        for( String mention : mentions ) {
            PostMention postMention = new PostMention();
            System.out.println(mention);

            postMention.setPost( p );
            postMention.setNickname(mention);

            pmr.save(postMention);

            Member memberByNickname = mr.findByNickname(mention).orElse(null);

            Notification notification = new Notification();
            notification.setMember(memberByNickname); // 알림을 받을 사용자
            notification.setMessagefrom(member.get().getNickname()); // 좋아요 누른 사용자 이름
            notification.setMessage(p.getPostId()+"번 게시물에서 "+member.get().getNickname() + "님이 회원님을 언급했습니다.");
            notification.setReadOnNot(0);

            Notification afternotification =  nr.save(notification); // 저장

            // ✅ SSE 알림 전송
            ses.sendNotification(memberByNickname.getMemberId(), notification.getMessage(), afternotification);


        }


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

    public Page<Post> getPostList2(String word , Paging paging ) {
        Page<Post> list = null;

//        word = "망고주스";

//        list = pr.findAll(Sort.by(Sort.Direction.DESC, "postId"));
//        list = pr.findAll()
//
//        paging.setTotalCount(list.size());
//        paging.getStartNum();

        int page = paging.getPage();



        Pageable pageable = PageRequest.of(page, 1, Sort.by(Sort.Order.desc("postId")));

        if( word == null || word.equals("") ) {
            System.out.println("word == null");
            // 검색어가 비어있으면 모두 검색
//            list = pdao.getPostListByPaging( paging.getStartNum(), paging.getDisplayRow() );
            list = pr.findAllByOrderByPostIdDesc(pageable);
        }else{
            System.out.println("word != null");
//            Optional<Hashtag> hashtag = hr.findByWord(word);  // word 를 hasgtag 테이블에서 검색

            List<Hashtag> hashtags = hr.findByWordContaining(word);
            if( hashtags.size() > 0 ) {
                list = pr.findAllByHashtags(hashtags, pageable);
            }else {
                list = pr.findAllByOrderByPostIdDesc(pageable);
            }


//            if( hashtags.isPresent() ) {
//                list = pr.findAllByHashtags(hashtags, pageable);
//            }else{
//                list = pr.findAllByOrderByPostIdDesc(pageable);
//            }


//            if( !hashtags.isPresent() ) {
//                // 검색하려는 단어가 한번도 등록된적이 없으면 모두검색
//
//                list = pr.findAllByOrderByPostIdDesc(pageable);
////                list = pr.findAll(Sort.by(Sort.Direction.DESC, "postId"));  // 검색 결과가 없으면 모두 검색
//            }else{
//                // 검색하려는 단어가 hashag 테이블에 있는 단어라면
//                // List<PostHash> phList = phr.findByHashid(  record.get().getId() );
////                List<Post> list2 = pdao.getPostListByTagByPage( hashtag.get().getHashtagId(), paging.getStartNum(), paging.getDisplayRow()  );
//
////                list = pr.findAllByHashtagId(hashtag.get().getHashtagId(), pageable);
//
//                list = pr.findAllByHashtags(hashtags, pageable);
//            }

        }

        // ✅ 이제 list가 null이 아니므로 totalPages를 안전하게 호출할 수 있음
        int totalPages = list.getTotalPages();
        if (page >= totalPages) {
            page = Math.max(0, totalPages - 1);
            pageable = PageRequest.of(page, 1, Sort.by(Sort.Order.desc("postId"))); // 변경된 page 적용
            list = pr.findAllByOrderByPostIdDesc(pageable);
        }

        // 마지막 페이지인지 확인 후 처리
        if (list.isLast()) {
            System.out.println("마지막 페이지입니다.");
            paging.setPage(Math.max(0, list.getTotalPages() - 1)); // 마지막 페이지로 고정
        }





        return list;
    }

    public Post getPostByPostId(int postid) {
        return pr.findByPostId(postid);
    }


    public Post getPostOneWithin3daysOrderByRand() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -3);
        Timestamp threeDaysAgo = new Timestamp(cal.getTimeInMillis());

        // Pageable로 한 개의 결과만 가져오기
        Pageable pageable = PageRequest.of(0, 1);

        List<Post> posts = pr.findRandomPostWithinLast3Days(threeDaysAgo, pageable);

        // 게시글이 있으면 첫 번째 게시글을 리턴, 없으면 null
        return posts.isEmpty() ? null : posts.get(0);
    }

    // 광고를 랜덤하게 가져오고 adCount를 증가시킨 후 저장
    public Ads getRandomAdAndIncrementCount() {
        // 광고 리스트에서 랜덤으로 하나 선택
        Ads ad = ar.findAll()
                .stream()
                .skip(new Random().nextInt((int) ar.findAll().stream().count()))  // 랜덤한 인덱스
                .findFirst()
                .get();

        // adCount 증가
        ad.incrementAdCount();

        // 변경된 ad 객체를 저장 (데이터베이스 반영)
        ar.save(ad);

        return ad;
    }
}











