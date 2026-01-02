# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - heading "Welcome Back" [level=3] [ref=e6]
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic [ref=e10]: Email
          - textbox "you@example.com" [active] [ref=e11]
        - generic [ref=e12]:
          - generic [ref=e13]: Password
          - textbox "••••••••" [ref=e14]: password123
        - button "Sign In" [ref=e15]
      - generic [ref=e16]:
        - text: Don't have an account?
        - link "Sign up" [ref=e17] [cursor=pointer]:
          - /url: /register
  - region "Notifications alt+T"
```