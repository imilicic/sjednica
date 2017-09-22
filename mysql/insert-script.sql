INSERT INTO Roles (Name)
VALUES ("admin");

INSERT INTO Roles (Name)
VALUES ("user");


INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleId)
VALUES ("Ivo", "Ivić", "ivo@mail.hr", NULL, "af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1", 1);

INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleId)
VALUES ("Marko", "Markić", "marko@mail.hr", NULL, "af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1", 1);

INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleId)
VALUES ("Ana", "Anić", "ana@mail.hr", NULL, "af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1", 2);

INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleId)
VALUES ("Pero", "Perić", "pero@mail.hr", NULL, "af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1", 2);

INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleId)
VALUES ("Luka", "Lukić", "luka@mail.hr", NULL, "af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1", 2);

INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleId)
VALUES ("Iva", "Ivić", "iva@mail.hr", NULL, "af3d7cb43b6bfdf23561d8b6fcbc9b4ff2932d7e88ef776807bd5870163f84495ca90f3ffd05b99148c5c936f36e1c38e49e84379cfa5899495db2e72bd8df04", "980b5986e28191a1", 2);
-- password: proba


INSERT INTO CouncilMemberships (UserId, StartDate, EndDate)
VALUES (2, "2015-10-01", "2016-10-01");

INSERT INTO CouncilMemberships (UserId, StartDate, EndDate)
VALUES (2, "2016-10-01", "2017-12-01");
-- Marko je u vijeću

INSERT INTO CouncilMemberships (UserId, StartDate, EndDate)
VALUES (3, "2015-10-01", "2016-10-01");

INSERT INTO CouncilMemberships (UserId, StartDate, EndDate)
VALUES (3, "2016-10-01", "2017-12-01");
-- Ana je u vijeću

INSERT INTO CouncilMemberships (UserId, StartDate, EndDate)
VALUES (4, "2015-10-01", "2016-12-01");
-- Pero je bio u vijeću, ali sada nije

INSERT INTO CouncilMemberships (UserId, StartDate, EndDate)
VALUES (5, "2016-10-01", "9999-12-31");
-- Luka je stalan član vijeća

/*
		    č. v.	1.s.	2.s.
1 - Ivo		-	    +   	+
2 - Marko	+	    +	    -
3 - Ana		+	    +	    +
4 - Pero	-	    +	    -
5 - Luka	+   	-	    +
6 - Iva		-	    -	    +
*/

INSERT INTO Types (Name) VALUES ("electronic remotely");
INSERT INTO Types (Name) VALUES ("electronic localy");
INSERT INTO Types (Name) VALUES ("non electronic");

-- prva neelektronska sjednica
INSERT INTO Meetings (Address, City, DateTime, Number, NumberInYear, TypeId)
VALUES ("Trg Ljudevita Gaja 6", "Osijek", "2015-11-02 12:00", 1, 1, 3);

INSERT INTO MeetingNotifications (MeetingId, Text)
VALUES (1, "Obavijest");

INSERT INTO AgendaItems (MeetingId, Number, Text)
VALUES (1, 1, "Prva točka sjednice");

INSERT INTO AgendaItems (MeetingId, Number, Text)
VALUES (1, 2, "Druga točka sjednice");

INSERT INTO AgendaDocuments (Description, URL, AgendaItemId)
VALUES ("Link", "https://www.dropbox.com/s/br4w9t6cd8iw8u4/03_DIMBP201617_zadaca3.pdf?dl=0", 1);

-- glasovi za prvu neelektronsku sjednicu
INSERT INTO CummulativeVotes (AgendaItemId, VotesFor, VotesAgainst, VotesAbstain)
VALUES (1, 3, 0, 1);

INSERT INTO CummulativeVotes (AgendaItemId, VotesFor, VotesAgainst, VotesAbstain)
VALUES (2, 3, 1, 0);

-- prisutnost na prvoj neelektronskoj sjednici
/*
    prisutni članovi vijeća: Marko i Ana
    odsutni članovi vijeća: Luka
    prisutni ostali: Ivo i Pero
    odsutni ostali: Iva (ne sprema se u tablicu)
*/
INSERT INTO PresenceOfUsers (UserId, MeetingId)
VALUES (1, 1);

INSERT INTO PresenceOfUsers (UserId, MeetingId)
VALUES (2, 1);

INSERT INTO PresenceOfUsers (UserId, MeetingId)
VALUES (3, 1);

INSERT INTO PresenceOfUsers (UserId, MeetingId)
VALUES (4, 1);

INSERT INTO AbsenceOfCouncilMembers (CouncilMembershipId, MeetingId, Reason)
VALUES (6, 1, "Bolestan");

-- druga elektronska lokalna sjednica
INSERT INTO Meetings (Address, City, DateTime, Number, NumberInYear, TypeId)
VALUES ("Trg Ljudevita Gaja 6", "Osijek", "2016-11-02 12:00", 2, 1, 2);

INSERT INTO MeetingNotifications (MeetingId, Text)
VALUES (2, "Obavijest");

INSERT INTO AgendaItems (MeetingId, Number, Text)
VALUES (2, 1, "Prva točka sjednice");

INSERT INTO AgendaItems (MeetingId, Number, Text)
VALUES (2, 2, "Druga točka sjednice");

INSERT INTO AgendaDocuments (Description, URL, AgendaItemId)
VALUES ("Link", "https://www.dropbox.com/s/br4w9t6cd8iw8u4/03_DIMBP201617_zadaca3.pdf?dl=0", 4);

-- prisutnost na drugoj elektronskoj sjednici
/*
    prisutni članovi vijeća: Luka i Ana
    odsutni članovi vijeća: Marko
    prisutni ostali: Ivo, Iva
    odsutni ostali: Pero (ne sprema se u tablicu)
*/
INSERT INTO PresenceOfUsers (UserId, MeetingId)
VALUES (1, 2);

INSERT INTO PresenceOfUsers (UserId, MeetingId)
VALUES (3, 2);

INSERT INTO PresenceOfUsers (UserId, MeetingId)
VALUES (5, 2);

INSERT INTO PresenceOfUsers (UserId, MeetingId)
VALUES (6, 2);

INSERT INTO AbsenceOfCouncilMembers (CouncilMembershipId, MeetingId, Reason)
VALUES (2, 2, "Bolestan");

-- glasovi druge elektronske sjednice
-- vote: 2 = za, 1 = suzdržan, 0 = protiv
/*
            1.  2.
    Ivo     z   z
    Marko   x   x
    Ana     z   s
    Pero    x   x
    Luka    s   -
    Iva     p   s
    (x = odsutan, - = nije glasao)

    Σ t.1: za 2, s: 1, pr: 1
    Σ t.2: za 1, s: 2, pr: 0
*/
INSERT INTO Votes (AgendaItemId, UserId, Vote)
VALUES (3, 1, 2);

INSERT INTO Votes (AgendaItemId, UserId, Vote)
VALUES (3, 3, 2);

INSERT INTO Votes (AgendaItemId, UserId, Vote)
VALUES (3, 5, 1);

INSERT INTO Votes (AgendaItemId, UserId, Vote)
VALUES (3, 6, 0);

INSERT INTO Votes (AgendaItemId, UserId, Vote)
VALUES (4, 1, 2);

INSERT INTO Votes (AgendaItemId, UserId, Vote)
VALUES (4, 3, 1);

-- INSERT INTO Votes (AgendaItemId, UserId, Vote)
-- VALUES (4, 5, );

INSERT INTO Votes (AgendaItemId, UserId, Vote)
VALUES (4, 6, 1);

-- sjednice u budućnosti
INSERT INTO Meetings (Address, City, DateTime, Number, NumberInYear, TypeId)
VALUES ("Trg Ljudevita Gaja 6", "Osijek", "2017-09-22 12:00", 3, 1, 1);

INSERT INTO Meetings (Address, City, DateTime, Number, NumberInYear, TypeId)
VALUES ("Trg Ljudevita Gaja 6", "Osijek", "2017-09-22 12:15", 3, 2, 1);

INSERT INTO Meetings (Address, City, DateTime, Number, NumberInYear, TypeId)
VALUES ("Trg Ljudevita Gaja 6", "Osijek", "2017-09-22 12:30", 3, 3, 1);