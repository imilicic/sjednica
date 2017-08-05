CREATE TABLE Role (
	RoleId INT AUTO_INCREMENT,
	RoleName VARCHAR(40) NOT NULL,
	PRIMARY KEY (RoleId)
);

INSERT INTO Role (RoleId)
VALUES ('admin');

INSERT INTO Role (RoleId)
VALUES ('clan vijeca');

INSERT INTO Role (RoleId)
VALUES ('korisnik');

CREATE TABLE Person (
	PersonId INT AUTO_INCREMENT,
	FirstName VARCHAR(40) NOT NULL,
	LastName VARCHAR(40) NOT NULL,
	Email VARCHAR(40) NOT NULL,
	PhoneNumber VARCHAR(40),
	Password VARCHAR(255) NOT NULL,
	RoleId INT NOT NULL,
	PRIMARY KEY (PersonId),
	FOREIGN KEY (RoleId)
		REFERENCES Role(RoleId)
);

INSERT INTO Person (FirstName, LastName, Email, PhoneNumber, Password, RoleId)
VALUES ('Ivan','Miličić','imilicic@mathos.hr',NULL,'proba',1);