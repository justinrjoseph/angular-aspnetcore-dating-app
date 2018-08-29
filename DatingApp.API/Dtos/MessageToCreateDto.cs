using System;

namespace DatingApp.API.Dtos
{
    public class MessageToCreateDto
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public DateTime DateSent { get; set; }
        public string Content { get; set; }

        public MessageToCreateDto()
        {
            DateSent = DateTime.Now;
        }
    }
}