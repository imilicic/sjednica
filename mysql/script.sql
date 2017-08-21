DROP TABLE CouncilMemberships;
DROP TABLE Users;
DROP TABLE Roles;
DROP TABLE AgendaDocuments;
DROP TABLE AgendaItems;
DROP TABLE MeetingNotifications;
DROP TABLE Meetings;
DROP TABLE Types;

CREATE TABLE Roles (
	RoleId INT AUTO_INCREMENT,
	Name VARCHAR(40) NOT NULL,
	PRIMARY KEY (RoleId)
);

INSERT INTO Roles (Name)
VALUES ("admin");

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
VALUES ("User", "Userić", "user@mail.hr", NULL, "af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1", 2);
-- password: proba

CREATE TABLE CouncilMemberships (
	CouncilMembershipId INT AUTO_INCREMENT,
	UserId INT NOT NULL,
	StartDate DATE NOT NULL,
	EndDate DATE NOT NULL,
	PRIMARY KEY (CouncilMembershipId),
	FOREIGN KEY (UserId)
		REFERENCES Users(UserId)
);

INSERT INTO CouncilMemberships (UserId, StartDate, EndDate)
VALUES (2, "2016-10-01", "2017-10-01");

CREATE TABLE Types (
	TypeId INT AUTO_INCREMENT,
	Name VARCHAR(40) NOT NULL,
	PRIMARY KEY (TypeId)
);

INSERT INTO Types (Name) VALUES ("electronic remotely");
INSERT INTO Types (Name) VALUES ("electronic localy");
INSERT INTO Types (Name) VALUES ("non electronic");

CREATE TABLE Meetings (
	MeetingId INT AUTO_INCREMENT,
	Address VARCHAR(40) NOT NULL,
	City VARCHAR(40) NOT NULL,
	DateTime DATETIME NOT NULL,
	Number INT NOT NULL,
	NumberInYear INT NOT NULL,
	TypeId INT NOT NULL,
	PRIMARY KEY (MeetingId),
	FOREIGN KEY (TypeId)
		REFERENCES Types(TypeId)
);

INSERT INTO Meetings (Address, City, DateTime, Number, NumberInYear, TypeId)
VALUES ("Trg Ljudevita Gaja 6", "Osijek", "2017-06-14 12:00", 1, 152, 1);

CREATE TABLE MeetingNotifications (
	MeetingNotificationId INT AUTO_INCREMENT,
	MeetingId INT NOT NULL,
	Text VARCHAR(500) NOT NULL,
	PRIMARY KEY (MeetingNotificationId),
	FOREIGN KEY (MeetingId)
		REFERENCES Meetings(MeetingId)
);

INSERT INTO MeetingNotifications (MeetingId, Text)
VALUES (1, "Dodatni termini iz predmeta Diplomski seminar u akademskoj 2016./2017. godini održat će se u zadnjem tjednu lipnja i početkom rujna. Također se odobrava i mogućnost održavanja Diplomskog seminara u zadnjem tjednu rujna, bude li zainteresiranih kandidata. Broj termina kao i vrijeme održavanja odredit će sukladno potrebama voditelj Diplomskog seminara.");

CREATE TABLE AgendaItems (
	AgendaItemId INT AUTO_INCREMENT,
	MeetingId INT NOT NULL,
	Number INT NOT NULL,
	Text VARCHAR(500) NOT NULL,
	PRIMARY KEY (AgendaItemId),
	FOREIGN KEY (MeetingId)
		REFERENCES Meetings(MeetingId)
);

INSERT INTO AgendaItems (MeetingId, Number, Text)
VALUES (1, 1, "Usvajanje zapisnika  s 151. sjednice Vijeća Odjela od 12. lipnja 2017. godine");

INSERT INTO AgendaItems (MeetingId, Number, Text)
VALUES (1, 2, "Donošenje Odluke o održavanju izvanrednih dodatnih termina iz predmeta Diplomski seminar u akademskoj 2016./2017. godini");

CREATE TABLE AgendaDocuments (
	AgendaDocumentId INT AUTO_INCREMENT,
	Description VARCHAR(500),
	Url VARCHAR(50) NOT NULL,
	AgendaItemId INT NOT NULL,
	PRIMARY KEY (AgendaDocumentId),
	FOREIGN KEY (AgendaItemId)
		REFERENCES AgendaItems(AgendaItemId)
);

INSERT INTO AgendaDocuments (Description, Url, AgendaItemId)
VALUES ("Link na zadaću", "https://www.dropbox.com/s/br4w9t6cd8iw8u4/03_DIMBP201617_zadaca3.pdf?dl=0", 1);

CREATE PROCEDURE CheckIfCouncilMember (
	IN userId INT,
	OUT isCouncilMember TINYINT
)
BEGIN
	SELECT 1
	INTO isCouncilMember
	FROM HistoryCouncilMembers
	WHERE UserId = userId
	AND NOW() BETWEEN StartDate AND EndDate;
END//