using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel model)
    {
        // Şifre doğrulama işlemini buraya ekleyin
        if (model.Password == "yourpassword")
        {
            var token = JwtHelper.GenerateToken(model.Password);
            return Ok(new { Token = token });
        }
        return Unauthorized();
    }

    [HttpPost("validate")]
    public IActionResult Validate([FromBody] TokenModel model)
    {
        var principal = JwtHelper.ValidateToken(model.Token);
        if (principal != null)
        {
            return Ok(new { Message = "Token is valid" });
        }
        return Unauthorized();
    }
}

public class LoginModel
{
    public string Password { get; set; }
}

public class TokenModel
{
    public string Token { get; set; }
}
