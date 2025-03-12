package com.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.exception.ResourceNotFoundException;
import com.model.BlogDTO;
import com.model.BlogEntity;
import com.repository.BlogRepository;

@Service
public class BlogServiceImpl implements BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Override
    public BlogDTO createBlog(BlogDTO blogDTO) {
        BlogEntity blogEntity = convertToEntity(blogDTO);
        BlogEntity savedEntity = blogRepository.save(blogEntity);
        return convertToDTO(savedEntity);
    }

    @Override
    public BlogDTO getBlogById(Long id) {
        BlogEntity blogEntity = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        return convertToDTO(blogEntity);
    }

    @Override
    public BlogDTO updateBlog(Long id, BlogDTO blogDTO) {
        if (!blogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog not found");
        }
        blogDTO.setId(id);
        BlogEntity updatedEntity = blogRepository.save(convertToEntity(blogDTO));
        return convertToDTO(updatedEntity);
    }

    @Override
    public Boolean deleteBlog(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog not found");
        }
        blogRepository.deleteById(id);
        return true;
    }

    @Override
    public List<BlogDTO> findAll() {
        return blogRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private BlogEntity convertToEntity(BlogDTO blogDTO) {
        return new BlogEntity(blogDTO.getId(), blogDTO.getTitle(), blogDTO.getContent());
    }

    private BlogDTO convertToDTO(BlogEntity blogEntity) {
        return new BlogDTO(blogEntity.getId(), blogEntity.getTitle(), blogEntity.getContent());
    }
}
