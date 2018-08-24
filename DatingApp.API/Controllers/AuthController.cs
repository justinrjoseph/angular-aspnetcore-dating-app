using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(
            IAuthRepository repo,
            IConfiguration config,
            IMapper mapper)
        {
            _repo = repo;
            _config = config;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userDto)
        {
            userDto.Username = userDto.Username.ToLower();

            if (await _repo.UserExists(userDto.Username))
                return BadRequest("Username already exists.");

            var userToMap = _mapper.Map<User>(userDto);

            var createdUser = await _repo.Register(userToMap, userDto.Password);

            var user = _mapper.Map<UserForDetailsDto>(createdUser);

            return CreatedAtRoute(
                "GetUser",
                new { controller = "Users", id = userToMap.Id },
                user
            );
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userDto)
        {
            var userFromRepo = await _repo.Login(userDto.Username.ToLower(), userDto.Password);

            if (userFromRepo == null) return Unauthorized();

            // user-specific JWT payload
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            // JWT secret
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value)
            );

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // add expiration to JWT
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var user = _mapper.Map<UserForListDto>(userFromRepo);

            return Ok(new {
                token = tokenHandler.WriteToken(token),
                user
            });
        }
    }
}