package com.xdpmtmhpl.post_service.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class MultiFile {

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "type", nullable = false)
    private String type;
}
