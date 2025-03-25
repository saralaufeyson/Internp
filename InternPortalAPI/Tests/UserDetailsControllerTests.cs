#nullable enable
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using InternPortal.Controllers;
using InternPortal.Interfaces;
using InternPortal.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace InternPortal.Tests
{
    public class UserDetailsControllerTests
    {
        private readonly Mock<IUserDetailsRepository> _mockRepo;
        private readonly UserDetailsController _controller;

        public UserDetailsControllerTests()
        {
            _mockRepo = new Mock<IUserDetailsRepository>();
            _controller = new UserDetailsController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetUserDetails_ReturnsOk_WhenUserExists()
        {
            // Arrange
            var userId = "123";
            var userDetails = new UserDetails
            {
                UserId = userId,
                Email = "test@example.com",
                PhoneNumber = "123-456-7890",
                Address = "123 Test Street",
                TenthGrade = "95",
                TwelfthGrade = "90",
                BTechCgpa = "8.5"
            };
            _mockRepo.Setup(repo => repo.GetUserDetailsAsync(userId)).ReturnsAsync(userDetails);

            // Act
            var result = await _controller.GetUserDetails(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(userDetails, okResult.Value);
        }

        [Fact]
        public async Task GetUserDetails_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = "123";
            _mockRepo.Setup(repo => repo.GetUserDetailsAsync(userId)).ReturnsAsync((UserDetails?)null); // Explicitly mark as nullable

            // Act
            var result = await _controller.GetUserDetails(userId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task AddExperience_ReturnsOk_WhenExperienceIsAdded()
        {
            // Arrange
            var userId = "123";
            var experience = new Experience 
            { 
                Title = "Software Engineer", 
                Company = "TechCorp", 
                Duration = "2 years", 
                Location = "New York" 
            };
            var userDetails = new UserDetails
            {
                UserId = userId,
                Experiences = new List<Experience>(),
                PhoneNumber = "123-456-7890",
                Email = "test@example.com",
                Address = "123 Test Street",
                TenthGrade = "95",
                TwelfthGrade = "90",
                BTechCgpa = "8.5"
            };
            _mockRepo.Setup(repo => repo.GetUserDetailsAsync(userId)).ReturnsAsync(userDetails);
            _mockRepo.Setup(repo => repo.UpdateUserDetailsAsync(userId, userDetails)).Returns(Task.FromResult(true));

            // Act
            var result = await _controller.AddExperience(userId, experience);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains(experience, userDetails.Experiences);
        }
    }
}
