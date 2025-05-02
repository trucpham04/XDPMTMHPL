package com.xdpmtmhpl.post_service.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class MultiFile {
    private String url;
    private String type;
}
