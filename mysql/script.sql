CREATE TABLE Roles (
	RoleId INT AUTO_INCREMENT,
	Name VARCHAR(40) NOT NULL,
	PRIMARY KEY (RoleId)
);

INSERT INTO Roles (Name)
VALUES ("admin");

INSERT INTO Roles (Name)
VALUES ("councilmember");

INSERT INTO Roles (Name)
VALUES ("user");

CREATE TABLE Users (
	UserId INT AUTO_INCREMENT,
	FirstName VARCHAR(40) NOT NULL,
	LastName VARCHAR(40) NOT NULL,
	Email VARCHAR(40) NOT NULL,
	PhoneNumber VARCHAR(40),
	Password VARCHAR(255) NOT NULL,
	Salt VARCHAR(20) NOT NULL,
	RoleId INT NOT NULL,
	PRIMARY KEY (UserId),
	FOREIGN KEY (RoleId)
		REFERENCES Roles(RoleId)
);

INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleId)
VALUES ("Admin", "Adminić", "admin@mail.hr", NULL, "af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1", 1);

INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleId)
VALUES ("CouncilMember", "CouncilMemberić", "councilmember@mail.hr", NULL, "af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1", 2);

INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleId)
VALUES ("User", "Userić", "user@mail.hr", NULL, "af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1", 3);
-- password: proba

CREATE TABLE CouncilMembers (
	CouncilMemberId INT AUTO_INCREMENT,
	UserId INT NOT NULL,
	StartDate DATE NOT NULL,
	EndDate DATE NOT NULL,
	PRIMARY KEY (CouncilMemberId),
	FOREIGN KEY (UserId)
		REFERENCES Users(UserId)
);

INSERT INTO CouncilMembers (UserId, StartDate, EndDate)
VALUES (2, "2016-10-01", "2017-10-01");