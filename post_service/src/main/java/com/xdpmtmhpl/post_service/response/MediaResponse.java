package com.xdpmtmhpl.post_service.response;

import com.xdpmtmhpl.post_service.model.MultiFile;
import lombok.Data;

@Data
public class MediaResponse {
    private String url;
    private String type;
    private Integer postId;

    public static MediaResponse fromMultiFile(MultiFile multiFile, Integer postId) {
        MediaResponse response = new MediaResponse();
        response.setUrl(multiFile.getUrl());
        response.setType(multiFile.getType());
        response.setPostId(postId);
        return response;
    }
}