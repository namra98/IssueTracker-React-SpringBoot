# Session based Authentication
1. Create a new /login endpoint which validates username password and sets a cookie.
```java

    @PostMapping("/session/login")
    public ResponseEntity<String> LoginUsingSession(
            @RequestBody User user,
            HttpServletRequest request)
    {
        User dbUser = userService.FindByEmail(user.email).get();
        if(dbUser != null)
        {
            if(user.password.equals(dbUser.password))
            {
                // authentication succccessful.
                var session = request.getSession();
                session.setAttribute("username", user.name);
                return ResponseEntity.status(HttpStatus.OK).body("Login Successful");
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

```

2. Update /users endpoint to allow only authenticated requests.

```java
    @GetMapping("/users")
    public ResponseEntity<Object> ListUsers(HttpServletRequest request)
    {
        // Get the session and check if username data is set.
        var session = request.getSession();
        var usernameData = session.getAttribute("username");
        if(usernameData == null)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("UNAUTHORISED");
        }

        // auth successful, now get users and return.
        var users = userService.ListUsers();
        return ResponseEntity.ok(users);
    }
```

### WebMvcConfigurer.java
```java
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private AuthInterceptor authInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry)
    {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/users", "/users/**")
                .excludePathPatterns("/session/login");
    }
}
```

### AuthInterceptor.java
```java
package com.example.demo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Interceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) throws Exception
    {
        var session = request.getSession(false);
        if(session == null) {
            response.setStatus(401);
            response.getWriter().write("UNAUTHORIZED from INTERCEPTOR");
            return false;
        }
        var usernameData = session.getAttribute("username");
        if(usernameData == null)
        {
            response.setStatus(401);
            response.getWriter().write("UNAUTHORIZED from INTERCEPTOR");
            return false;
        }
        return true;
    }

}
```
