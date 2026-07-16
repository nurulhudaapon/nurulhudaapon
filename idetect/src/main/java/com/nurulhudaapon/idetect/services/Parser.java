package com.nurulhudaapon.idetect.services;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.nurulhudaapon.idetect.models.NationalId;

public class Parser {
    String nationalId = "(NATIONAL|ID CARD|ID NO:|Name:|Date of Birth:)";
    String smartCard = "/(National|ID Card|NID No.|Name|NID No)/";

    String birthDate = "((0[1-9]|[12]\\d|3[01]) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [12]\\d{3})";

    String smartCardName = "\\b(?!NID|ID C)\b[A-Z,\\s]{3,}"; // Global
    String nationalIdName = "Name(?:: )([a-z, A-Z, \\s]{3,})";

    String smartCardNumber = "\\d{3} \\d{3} \\d{4}";
    String nationalIdNumber17 = "[12]\\d{3}(\\d{13})";
    String nationalIdNumber13 = "\\d{13}";

    public NationalId parse(String scannedText) {

        Pattern nationalIdPattern = Pattern.compile(nationalId, Pattern.CASE_INSENSITIVE);
        Matcher nationalIdMatcher = nationalIdPattern.matcher(scannedText);

        Pattern smartCardPattern = Pattern.compile(smartCard, Pattern.CASE_INSENSITIVE);
        Matcher smartCardMatcher = smartCardPattern.matcher(scannedText);

        Pattern birthDatePattern = Pattern.compile(birthDate, Pattern.CASE_INSENSITIVE);
        Matcher birthDateMatcher = birthDatePattern.matcher(scannedText);

        Pattern smartCardNamePattern = Pattern.compile(smartCardName, Pattern.CASE_INSENSITIVE);
        Matcher smartCardNameMatcher = smartCardNamePattern.matcher(scannedText);

        Pattern nationalIdNamePattern = Pattern.compile(nationalIdName, Pattern.CASE_INSENSITIVE);
        Matcher nationalIdNameMatcher = nationalIdNamePattern.matcher(scannedText);

        Pattern smartCardNumberPattern = Pattern.compile(smartCardNumber, Pattern.CASE_INSENSITIVE);
        Matcher smartCardNumberMatcher = smartCardNumberPattern.matcher(scannedText);

        Pattern nationalIdNumber17Pattern = Pattern.compile(nationalIdNumber17, Pattern.CASE_INSENSITIVE);
        Matcher nationalIdNumber17Matcher = nationalIdNumber17Pattern.matcher(scannedText);

        if (nationalIdMatcher.find()) {
            NationalId nationalId = new NationalId();
            nationalId.setType("National ID");
            if (nationalIdNameMatcher.find()) {
                nationalId.setName(nationalIdNameMatcher.group(1));
            }
            if (nationalIdNumber17Matcher.find()) {
                nationalId.setNumber(nationalIdNumber17Matcher.group(1));
            }
            if (birthDateMatcher.find()) {
                nationalId.setDob(birthDateMatcher.group(1));
            }
            return nationalId;
        }

        if (smartCardMatcher.find()) {

        }

        return new NationalId();
    }
}
