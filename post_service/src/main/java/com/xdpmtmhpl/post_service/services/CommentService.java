// package com.xdpmtmhpl.post_service.services;

// import com.xdpmtmhpl.post_service.models.Comment;
// import com.xdpmtmhpl.post_service.models.Post;
// import com.xdpmtmhpl.post_service.models.User;
// import com.xdpmtmhpl.post_service.repository.CommentRepository;
// import com.xdpmtmhpl.post_service.repository.PostRepository;
// import com.xdpmtmhpl.post_service.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;

// @Service
// public class CommentService {

//     @Autowired
//     private CommentRepository commentsRepository;

//     @Autowired
//     private PostRepository postRepository;

//     @Autowired
//     private UserRepository userRepository;

//     // Lấy tất cả cmt
//     public List<Comment> getAllComments() {
//         return commentsRepository.findAll();
//     }

//     // Lấy cmt theo ID
//     public Optional<Comment> getCommentById(Long id) {
//         return commentsRepository.findById(id);
//     }

//     // Lấy tất cả cmt của 1 post
//     public List<Comment> getCommentsByPostId(Long postId) {
//         return commentsRepository.findByPostId(postId);
//     }

//     // Lấy danh sách bình luận của một user
//     public List<Comment> getCommentsByUserId(Long userId) {
//         return commentsRepository.findByUserId(userId);
//     }

//     // Tạo 1 cmt
//     public Comment createComment(String content, Long postId, Long userId) {
//         Post post = postRepository.findById(postId)
//                 .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

//         Comment comment = new Comment();
//         comment.setContent(content);
//         comment.setPost(post);
//         comment.setUser(user);
//         return commentsRepository.save(comment);
//     }

//     // Xóa bình luận
//     public void deleteComment(Long id) {
//         if (!commentsRepository.existsById(id)) {
//             throw new RuntimeException("Comment not found with id: " + id);
//         }
//         commentsRepository.deleteById(id);
//     }
// }
package com.xdpmtmhpl.post_service.services;

import com.xdpmtmhpl.post_service.client.UserServiceClient;
import com.xdpmtmhpl.post_service.dto.CommentDTO;
import com.xdpmtmhpl.post_service.dto.UserDTO;
import com.xdpmtmhpl.post_service.models.Comment;
import com.xdpmtmhpl.post_service.models.Post;
import com.xdpmtmhpl.post_service.repository.CommentRepository;
import com.xdpmtmhpl.post_service.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    public Page<CommentDTO> getCommentsByPostId(Long postId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findByPostId(postId, pageable);
        return comments.map(comment -> {
            UserDTO user = userServiceClient.getUserById(comment.getUserId());
            CommentDTO dto = new CommentDTO();
            dto.setId(comment.getId());
            dto.setPostId(comment.getPost().getId());
            dto.setUserId(comment.getUserId());
            dto.setUsername(user.getUsername());
            dto.setContent(comment.getContent());
            dto.setCreatedAt(comment.getCreatedAt());
            dto.setUpdatedAt(comment.getUpdatedAt());
            return dto;
        });
    }

    @Transactional
    public CommentDTO createComment(Long postId, CommentDTO commentDTO) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        UserDTO user = userServiceClient.getUserById(commentDTO.getUserId());
        if (user == null) {
            throw new EntityNotFoundException("User not found with id: " + commentDTO.getUserId());
        }

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUserId(commentDTO.getUserId());
        comment.setContent(commentDTO.getContent());
        comment = commentRepository.save(comment);

        CommentDTO result = new CommentDTO();
        result.setId(comment.getId());
        result.setPostId(postId);
        result.setUserId(comment.getUserId());
        result.setUsername(user.getUsername());
        result.setContent(comment.getContent());
        result.setCreatedAt(comment.getCreatedAt());
        result.setUpdatedAt(comment.getUpdatedAt());
        return result;
    }

    @Transactional
    public CommentDTO updateComment(Long commentId, CommentDTO commentDTO) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getUserId().equals(commentDTO.getUserId())) {
            throw new SecurityException("User not authorized to update this comment");
        }

        comment.setContent(commentDTO.getContent());
        comment = commentRepository.save(comment);

        UserDTO user = userServiceClient.getUserById(comment.getUserId());
        CommentDTO result = new CommentDTO();
        result.setId(comment.getId());
        result.setPostId(comment.getPost().getId());
        result.setUserId(comment.getUserId());
        result.setUsername(user.getUsername());
        result.setContent(comment.getContent());
        result.setCreatedAt(comment.getCreatedAt());
        result.setUpdatedAt(comment.getUpdatedAt());
        return result;
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getUserId().equals(userId)) {
            throw new SecurityException("User not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
