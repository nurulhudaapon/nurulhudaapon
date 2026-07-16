package com.nurulhudaapon.idetect.models;

public class NationalId {
    String countryCode;
    String idNumber;
    String specUrl;
    String name;
    String dob;
    String type;

    public void setNumber(String number) {
        idNumber = number;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }
}