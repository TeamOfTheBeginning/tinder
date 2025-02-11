package com.first.tinder.dto;

import lombok.Data;

@Data
public class Paging {
    private int page =1;
    private int displayRow=5;
    private int startNum;

    public void calPaging() {
        startNum = (page-1)*displayRow;
    }
}
