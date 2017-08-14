import { Injectable } from '@angular/core';

@Injectable()
export class PasswordService {
    /**
     * generates a password of given length
     * @function
     * @param length length of password
     * @param minLetters minimum number of letters in password (case insensitive)
     * @param minNumbers minimum number of numbers in password
     */
    generatePassword(length: number, minLetters: number, minNumbers: number) {
        let letters = 'abcdefghijklmnpqrstuvwxyz';
        let numbers = '123456789';
        let characters;

        let password = [];
        let chosen = '';

        // fill password with letters
        for (let i = 0; i < minLetters; i++) {
            chosen = letters[Math.floor(Math.random() * (letters.length - 1))];
            letters = letters.split(chosen).join(''); // deletes chosen letter

            if ((Math.random() < 0.5 || chosen === 'i' || chosen === 'o') && chosen !== 'l') {
                password.push(chosen);
            } else {
                password.push(chosen.toLocaleUpperCase());
            }
        }

        // fill password with numbers
        for (let i = 0; i < minNumbers; i++) {
            chosen = numbers[Math.floor(Math.random() * (numbers.length - 1))];
            numbers = numbers.split(chosen).join(''); // deletes chosen number

            password.push(chosen);
        }

        // fill the rest of password with any characters
        characters = letters + numbers;
        for (let i = password.length; i < length; i++) {
            chosen = characters[Math.floor(Math.random() * (characters.length - 1))]
            characters = characters.split(chosen).join(''); // deletes chosen number

            if ((Math.random() < 0.5 || chosen === 'i' || chosen === 'o') && chosen !== 'l') {
                password.push(chosen);
            } else {
                password.push(chosen.toLocaleUpperCase());
            }
        }

        return this.shuffleArray(password).join('');
    }

    /**
     * returns a random permutation of a given array
     * @function
     * @param array array of things to be shuffled
     */
    shuffleArray(array: any[]) {
        let currentIndex = array.length;
        let temporaryValue;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}
