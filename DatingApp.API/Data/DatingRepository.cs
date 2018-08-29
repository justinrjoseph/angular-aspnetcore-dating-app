using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
            return await _context.Photos.Where(p => p.UserId == userId)
                .FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(u => u.Photos)
                            .FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(u => u.Photos)
                .OrderByDescending(u => u.LastActive)
                .AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId)
                .Where(u => u.Gender == userParams.Gender);

            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);

                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);

                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(
                users, userParams.PageNumber, userParams.PageSize
            );
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes
                .FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
                .Include(u => u.Likers)
                .Include(u => u.Likees)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == id)
                    .Select(u => u.LikerId);
            }
            else
            {
                return user.Likees.Where(u => u.LikerId == id)
                    .Select(u => u.LikeeId);
            }
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetUserMessages(MessageParams msgParams)
        {
            var messages = _context.Messages
                .Include(u => u.Sender)
                .ThenInclude(u => u.Photos)
                .Include(u => u.Recipient)
                .ThenInclude(u => u.Photos)
                .AsQueryable();

            switch (msgParams.Container)
            {
                case "Inbox":
                    messages = messages
                        .Where(u => u.RecipientId == msgParams.UserId
                            && !u.RecipientDeleted);
                    break;
                case "Outbox":
                    messages = messages
                        .Where(u => u.SenderId == msgParams.UserId
                            && !u.SenderDeleted);
                    break;
                default:
                    messages = messages
                        .Where(u => u.RecipientId == msgParams.UserId
                            && !u.IsRead && !u.RecipientDeleted);
                    break;
            }

            messages = messages.OrderByDescending(d => d.DateSent);

            return await PagedList<Message>.CreateAsync(
                messages, msgParams.PageNumber, msgParams.PageSize
            );
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Include(u => u.Sender)
                .ThenInclude(u => u.Photos)
                .Include(u => u.Recipient)
                .ThenInclude(u => u.Photos)
                .Where(m => m.RecipientId == userId
                        && !m.RecipientDeleted
                        && m.SenderId == recipientId
                        || m.RecipientId == recipientId
                        && !m.SenderDeleted
                        && m.SenderId == userId)
                .OrderByDescending(m => m.DateSent)
                .ToListAsync();

            return messages;
        }
    }
}