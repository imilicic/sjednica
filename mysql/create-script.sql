DROP TABLE AbsenceOfCouncilMembers;
DROP TABLE PresenceOfUsers;
DROP TABLE CummulativeVotes;
DROP TABLE Votes;
DROP TABLE Votings;
DROP TABLE AgendaDocuments;
DROP TABLE AgendaItems;
DROP TABLE MeetingNotifications;
DROP TABLE Meetings;
DROP TABLE Types;
DROP TABLE CouncilMemberships;
DROP TABLE Users;
DROP TABLE Roles;

CREATE TABLE Roles (
	RoleId INT AUTO_INCREMENT,
	Name VARCHAR(40) NOT NULL,
	PRIMARY KEY (RoleId)
);

CREATE TABLE Users (
	UserId INT AUTO_INCREMENT,
	FirstName VARCHAR(40)
		CHARACTER SET utf8
		COLLATE utf8_unicode_ci
		NOT NULL,
	LastName VARCHAR(40)
		CHARACTER SET utf8
		COLLATE utf8_unicode_ci
		NOT NULL,
	Email VARCHAR(40) NOT NULL,
	PhoneNumber VARCHAR(40),
	Password VARCHAR(255) NOT NULL,
	Salt VARCHAR(20) NOT NULL,
	RoleId INT NOT NULL,
	UNIQUE (Email),
	PRIMARY KEY (UserId),
	FOREIGN KEY (RoleId)
		REFERENCES Roles(RoleId)
);

CREATE TABLE CouncilMemberships (
	CouncilMembershipId INT AUTO_INCREMENT,
	UserId INT NOT NULL,
	StartDate DATE NOT NULL,
	EndDate DATE NOT NULL,
	PRIMARY KEY (CouncilMembershipId),
	FOREIGN KEY (UserId)
		REFERENCES Users(UserId)
);

CREATE TABLE Types (
	TypeId INT AUTO_INCREMENT,
	Name VARCHAR(40)
		CHARACTER SET utf8
		COLLATE utf8_unicode_ci
		NOT NULL,
	PRIMARY KEY (TypeId)
);

CREATE TABLE Meetings (
	MeetingId INT AUTO_INCREMENT,
	Address VARCHAR(40)
		CHARACTER SET utf8
		COLLATE utf8_unicode_ci
		NOT NULL,
	City VARCHAR(40)
		CHARACTER SET utf8
		COLLATE utf8_unicode_ci
		NOT NULL,
	DateTime DATETIME NOT NULL,
	Number INT NOT NULL,
	NumberInYear INT NOT NULL,
	TypeId INT NOT NULL,
	PRIMARY KEY (MeetingId),
	FOREIGN KEY (TypeId)
		REFERENCES Types(TypeId)
);

CREATE TABLE MeetingNotifications (
	MeetingNotificationId INT AUTO_INCREMENT,
	MeetingId INT NOT NULL,
	Text VARCHAR(500) NOT NULL,
	PRIMARY KEY (MeetingNotificationId),
	FOREIGN KEY (MeetingId)
		REFERENCES Meetings(MeetingId)
);

CREATE TABLE AgendaItems (
	AgendaItemId INT AUTO_INCREMENT,
	MeetingId INT NOT NULL,
	Number INT NOT NULL,
	Text VARCHAR(500)
		CHARACTER SET utf8
		COLLATE utf8_unicode_ci
		NOT NULL,
	PRIMARY KEY (AgendaItemId),
	FOREIGN KEY (MeetingId)
		REFERENCES Meetings(MeetingId)
);

CREATE TABLE AgendaDocuments (
	AgendaDocumentId INT AUTO_INCREMENT,
	Description VARCHAR(500)
		CHARACTER SET utf8
		COLLATE utf8_unicode_ci,
	URL VARCHAR(200) NOT NULL,
	AgendaItemId INT NOT NULL,
	PRIMARY KEY (AgendaDocumentId),
	FOREIGN KEY (AgendaItemId)
		REFERENCES AgendaItems(AgendaItemId)
);

CREATE TABLE Votings (
	AgendaItemId INT NOT NULL,
	PRIMARY KEY (AgendaItemId),
	FOREIGN KEY (AgendaItemId)
		REFERENCES AgendaItems(AgendaItemId)
);

CREATE TABLE Votes (
	VoteId INT AUTO_INCREMENT,
	AgendaItemId INT NOT NULL,
	UserId INT NOT NULL,
	Vote TINYINT NOT NULL,
	PRIMARY KEY (VoteId),
	UNIQUE (AgendaItemId, UserId),
	FOREIGN KEY (AgendaItemId)
		REFERENCES AgendaItems(AgendaItemId),
	FOREIGN KEY (UserId)
		REFERENCES Users(UserId)
);

CREATE TABLE CummulativeVotes (
	AgendaItemId INT NOT NULL,
	VotesFor INT NOT NULL,
	VotesAgainst INT NOT NULL,
	VotesAbstain INT NOT NULL,
	PRIMARY KEY (AgendaItemId),
	FOREIGN KEY (AgendaItemId)
		REFERENCES AgendaItems(AgendaItemId)
);

CREATE TABLE PresenceOfUsers (
	PresenceOfUserId INT AUTO_INCREMENT,
	UserId INT NOT NULL,
	MeetingId INT NOT NULL,
	UNIQUE (UserId, MeetingId),
	PRIMARY KEY (PresenceOfUserId),
	FOREIGN KEY (UserId)
		REFERENCES Users(UserId),
	FOREIGN KEY (MeetingId)
		REFERENCES Meetings(MeetingId)
);

CREATE TABLE AbsenceOfCouncilMembers (
	AbsenceOfCouncilMemberId INT AUTO_INCREMENT,
	CouncilMembershipId INT NOT NULL,
	MeetingId INT NOT NULL,
	Reason VARCHAR(500)
		CHARACTER SET utf8
		COLLATE utf8_unicode_ci
		NOT NULL,
	UNIQUE (CouncilMembershipId, MeetingId),
	PRIMARY KEY (AbsenceOfCouncilMemberId),
	FOREIGN KEY (CouncilMembershipId)
		REFERENCES CouncilMemberships(CouncilMembershipId),
	FOREIGN KEY (MeetingId)
		REFERENCES Meetings(MeetingId)
);