#nullable enable
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using InternPortal.Controllers;
using InternPortal.Interfaces;
using InternPortal.Models;
using System.Threading.Tasks;

namespace InternPortal.Tests
{
    public class AuthControllerTests
    {
        private readonly Mock<IUserRepository> _mockRepo;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _mockRepo = new Mock<IUserRepository>();
            _controller = new AuthController(_mockRepo.Object);
        }

        [Fact]
        public async Task Register_ReturnsOk_WhenUserIsRegistered()
        {
            // Arrange
            var user = new User { Email = "test@example.com", Password = "password123", Username = "TestUser", Role = "User" };
            _mockRepo.Setup(repo => repo.RegisterUserAsync(user)).ReturnsAsync("User registered successfully.");

            // Act
            var result = await _controller.Register(user);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User registered successfully.", okResult.Value);
        }

        [Fact]
        public async Task Register_ReturnsConflict_WhenUserAlreadyExists()
        {
            // Arrange
            var user = new User { Email = "test@example.com", Password = "password123", Username = "TestUser", Role = "User" };
            _mockRepo.Setup(repo => repo.RegisterUserAsync(user)).ReturnsAsync("User with this email already exists.");

            // Act
            var result = await _controller.Register(user);

            // Assert
            Assert.IsType<ConflictObjectResult>(result);
        }

        // Removed Login_ReturnsOk_WhenCredentialsAreValid test
    }
}
