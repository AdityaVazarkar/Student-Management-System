package com.Student.StudentRegistration.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.*;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SystemController {

    private final RequestMappingHandlerMapping handlerMapping;

    @GetMapping("/routes")
    public ResponseEntity<List<Map<String, Object>>> getAllRegisteredRoutes() {
        List<Map<String, Object>> routeList = new ArrayList<>();

        handlerMapping.getHandlerMethods().forEach((info, method) -> {
            Set<String> patterns = info.getDirectPaths();
            if (patterns.isEmpty() && info.getPathPatternsCondition() != null) {
                patterns = info.getPathPatternsCondition().getPatternValues();
            }

            for (String pattern : patterns) {
                // Filter out error or default spring paths if any
                if (pattern.startsWith("/api/")) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("path", pattern);
                    map.put("methods", info.getMethodsCondition().getMethods().toString());
                    map.put("controller", method.getBeanType().getSimpleName());
                    map.put("methodName", method.getMethod().getName());
                    routeList.add(map);
                }
            }
        });

        routeList.sort(Comparator.comparing(m -> m.get("path").toString()));
        return ResponseEntity.ok(routeList);
    }
}
