using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<UserForRegisterDto, User>();

            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl, option => {
                    option.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest => dest.Age, option => {
                    option.ResolveUsing(u => u.DateOfBirth.CalculateAge());
                });

            CreateMap<User, UserForDetailsDto>()
                .ForMember(dest => dest.PhotoUrl, option => {
                    option.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest => dest.Age, option => {
                    option.ResolveUsing(u => u.DateOfBirth.CalculateAge());
                });

            CreateMap<UserForUpdateDto, User>();

            CreateMap<Photo, PhotosForDetailsDto>();

            CreateMap<Photo, PhotoToReturnDto>();

            CreateMap<PhotoToCreateDto, Photo>();

            CreateMap<MessageToCreateDto, Message>()
                .ReverseMap();

            CreateMap<Message, MessageToReturnDto>()
                .ForMember(m => m.SenderPhotoUrl, option => {
                    option.MapFrom(u => u.Sender.Photos
                        .FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(m => m.RecipientPhotoUrl, option => {
                    option.MapFrom(u => u.Recipient.Photos
                        .FirstOrDefault(p => p.IsMain).Url);
                });
        }
    }
}