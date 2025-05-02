package com.example.searchbackend.model;

import org.modelmapper.ModelMapper;

public class SearchHistoryMapper {
    private ModelMapper modelMapper = new ModelMapper();

    public SearchHistoryResponse convertToResponse(SearchHistory searchHistory, Integer searcherId,
            TargetUserDTO targetUserDTO) {
        // Ánh xạ các trường từ SearchHistory sang SearchHistoryResponse
        SearchHistoryResponse response = modelMapper.map(searchHistory, SearchHistoryResponse.class);

        // Thiết lập TargetUserDTO vào response
        response.setTargetUser(targetUserDTO);
        response.setSearcherId(searcherId);

        return response;
    }
}
