CREATE TABLE Role (
	RoleId INT AUTO_INCREMENT,
	RoleName VARCHAR(40) NOT NULL,
	PRIMARY KEY (RoleId)
);

INSERT INTO Role (RoleId)
VALUES ("admin");

INSERT INTO Role (RoleId)
VALUES ("clan vijeca");

INSERT INTO Role (RoleId)
VALUES ("korisnik");

CREATE TABLE Person (
	PersonId INT AUTO_INCREMENT,
	FirstName VARCHAR(40) NOT NULL,
	LastName VARCHAR(40) NOT NULL,
	Email VARCHAR(40) NOT NULL,
	PhoneNumber VARCHAR(40),
	Password VARCHAR(255) NOT NULL,
	Salt VARCHAR(20) NOT NULL,
	RoleId INT NOT NULL,
	PRIMARY KEY (PersonId),
	FOREIGN KEY (RoleId)
		REFERENCES Role(RoleId)
);

INSERT INTO Person (FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleId)
VALUES ("Ivan","Miličić","imilicic@mathos.hr",NULL,"af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1",1);
-- password: proba