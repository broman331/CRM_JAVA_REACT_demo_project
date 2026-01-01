package com.primecrm.core.search;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchCriteria {
    private String key;
    private String operation;
    private Object value;

    public static java.util.List<SearchCriteria> parse(String search) {
        java.util.List<SearchCriteria> list = new java.util.ArrayList<>();
        if (search != null && !search.isEmpty()) {
            String[] tokens = search.split(",");
            for (String token : tokens) {
                if (token.contains(">")) {
                    String[] parts = token.split(">");
                    list.add(new SearchCriteria(parts[0], ">", parts[1]));
                } else if (token.contains("<")) {
                    String[] parts = token.split("<");
                    list.add(new SearchCriteria(parts[0], "<", parts[1]));
                } else if (token.contains(":")) {
                    String[] parts = token.split(":");
                    list.add(new SearchCriteria(parts[0], ":", parts[1]));
                }
            }
        }
        return list;
    }
}
