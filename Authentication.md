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
