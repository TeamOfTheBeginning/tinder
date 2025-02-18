package com.first.tinder.controller.realtimechat;

import com.first.tinder.dao.realtimechat.RealTimeChatRoomRepository;
import com.first.tinder.entity.realtimechat.RealTimeChatRoom;
import com.first.tinder.service.realtimechat.RealTimeChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/realtime-chatrooms")
@RequiredArgsConstructor
@Slf4j
public class RealTimeChatRoomController {

    private final RealTimeChatRoomService chatRoomService;
    private final RealTimeChatRoomRepository chatRoomRepository;

    /** ✅ 채팅방 목록 조회 */
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getAllChatRooms() {
        List<RealTimeChatRoom> chatRooms = chatRoomRepository.findAll();

        List<Map<String, Object>> responseList = chatRooms.stream().map(room -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", room.getId());
            map.put("name", room.getName());
            map.put("isPrivate", room.isPrivate());
            map.put("password", room.getPassword());
            map.put("creatorNickname", room.getCreator() != null ? room.getCreator().getNickname() : "");
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    /** ✅ 채팅방 생성 */
    @PostMapping("/create")
    public ResponseEntity<RealTimeChatRoom> createRoom(
            @RequestParam String name,
            @RequestParam(required = false, defaultValue = "false") Boolean isPrivate,
            @RequestParam(required = false) String password,
            @RequestParam String nickname) {

        log.info("채팅방 생성 요청 -> Name: {}, isPrivate: {}, Password: {}, Creator: {}", name, isPrivate, password, nickname);

        if (isPrivate == null) isPrivate = false;

        try {
            RealTimeChatRoom chatRoom = chatRoomService.createRoom(name, isPrivate, password, nickname);

            return ResponseEntity.ok(chatRoom);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /** ✅ 비밀번호 검증 */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validateRoomPassword(
            @RequestParam Long roomId,
            @RequestParam String password) {

        Map<String, Boolean> response = new HashMap<>();

        if (roomId == null || password == null || password.trim().isEmpty()) {
            response.put("valid", false);
            return ResponseEntity.ok(response);
        }

        boolean isValid = chatRoomService.validateRoomPassword(roomId, password);
        response.put("valid", isValid);

        return ResponseEntity.ok(response);
    }

    /** ✅ 채팅방 삭제 */
    @DeleteMapping("/delete/{roomId}")
    public ResponseEntity<Map<String, String>> deleteChatRoom(
            @PathVariable Long roomId,
            @RequestParam String nickname) {

        Map<String, String> response = new HashMap<>();
        boolean isDeleted = chatRoomService.deleteRoom(roomId, nickname);

        if (isDeleted) {
            response.put("message", "채팅방이 삭제되었습니다.");

            return ResponseEntity.ok(response);
        } else {
            response.put("message", "채팅방 삭제 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }
}
