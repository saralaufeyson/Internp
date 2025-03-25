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

        [Fact]
        public async Task Login_ReturnsOk_WhenCredentialsAreValid()
        {
            // Arrange
            var request = new LoginRequest { Email = "test@example.com", Password = "password123" };
            var user = new User { Id = "123", Role = "Admin", Username = "TestUser", Email = "test@example.com", Password = "password123" };
            _mockRepo.Setup(repo => repo.LoginUserAsync(request)).ReturnsAsync((true, "Login successful.", (User?)null)); // Explicitly mark as nullable

            // Act
            var result = await _controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = okResult.Value as dynamic;
            Assert.NotNull(response); // Ensure response is not null
            Assert.Equal("Login successful.", response?.Message);
        }
    }
}
