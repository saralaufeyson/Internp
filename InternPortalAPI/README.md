## Dependency Management

### Adding Dependencies
Use the following command to add a new dependency:
```bash
dotnet add package <PackageName>
```

### Updating Dependencies
To update all dependencies to their latest versions:
```bash
dotnet outdated
dotnet add package <PackageName> --version <Version>
```

### Auditing Dependencies
To check for vulnerabilities in dependencies:
```bash
dotnet list package --vulnerable
```

### Restoring Dependencies
To restore dependencies:
```bash
dotnet restore
```

## Running Tests

To run the unit tests, use the following command:
```bash
dotnet test
```
