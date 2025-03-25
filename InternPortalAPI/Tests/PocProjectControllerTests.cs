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
    public class PocProjectControllerTests
    {
        private readonly Mock<IPocProjectRepository> _mockRepo;
        private readonly PocProjectController _controller;

        public PocProjectControllerTests()
        {
            _mockRepo = new Mock<IPocProjectRepository>();
            _controller = new PocProjectController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetPocProjects_ReturnsOk_WhenProjectsExist()
        {
            // Arrange
            var userId = "123";
            var projects = new List<PocProject>
            {
                new PocProject { UserId = userId, ProjectName = "Project1", Description = "Sample Description", Status = "Active" }
            };
            _mockRepo.Setup(repo => repo.GetPocProjectsByUserIdAsync(userId)).ReturnsAsync(projects);

            // Act
            var result = await _controller.GetPocProjects(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(projects, okResult.Value);
        }

        [Fact]
        public async Task GetPocProjects_ReturnsNotFound_WhenNoProjectsExist()
        {
            // Arrange
            var userId = "123";
            _mockRepo.Setup(repo => repo.GetPocProjectsByUserIdAsync(userId)).ReturnsAsync(new List<PocProject>());

            // Act
            var result = await _controller.GetPocProjects(userId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}
