using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(
            IDatingRepository repo,
            IMapper mapper,
            IOptions<CloudinarySettings> cloudinaryConfig
        )
        {
                _repo = repo;
                _cloudinaryConfig = cloudinaryConfig;
                _mapper = mapper;

                Account acct = new Account(
                    _cloudinaryConfig.Value.CloudName,
                    _cloudinaryConfig.Value.ApiKey,
                    _cloudinaryConfig.Value.ApiSecret
                );

                _cloudinary = new Cloudinary(acct);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhoto(int userId, [FromForm]PhotoToCreateDto photoDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);

            var file = photoDto.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                            .Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoDto.Url = uploadResult.Uri.ToString();
            photoDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoDto);

            if (!user.Photos.Any(p => p.IsMain))
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoToReturnDto>(photo);

                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
            }

            return BadRequest("There was a problem adding the photo.");
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoToMap = await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoToReturnDto>(photoToMap);

            return Ok(photo);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photo = await _repo.GetPhoto(id);

            if (photo.IsMain)
                return BadRequest("You cannot delete your main photo.");

            if (photo.PublicId == null)
            {
                _repo.Delete(photo);
            }
            else
            {
                var deleteParams = new DeletionParams(photo.PublicId);

                var action = _cloudinary.Destroy(deleteParams);

                if (action.Result == "ok")
                {
                    _repo.Delete(photo);
                }
            }

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("There was a problem deleting the photo.");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> setMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photo = await _repo.GetPhoto(id);

            if (photo.IsMain)
                return BadRequest("This is already the main photo.");

            var mainPhoto = await _repo.GetMainPhoto(userId);

            mainPhoto.IsMain = false;

            photo.IsMain = true;

            if (await _repo.SaveAll())
                return NoContent();

            return BadRequest("There was a problem setting the main photo.");
        }
    }
}