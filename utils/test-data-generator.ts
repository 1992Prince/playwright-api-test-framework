import { faker } from '@faker-js/faker';

/**
 * ✅ Test Data Generator Utility
 * --------------------------------
 * Centralized faker-based utility for generating realistic test data.
 * Includes:
 *  - Generic user info (names, emails, phones)
 *  - Address/location details
 *  - Auto insurance–specific entities (vehicle, policy, driver)
 *  - Text data for titles, descriptions, bodies
 * 
 * Install dependency:
 *    npm install @faker-js/faker
 */

export class TestDataGenerator {

    // -------------------- BASIC INFO --------------------

    static getFirstName(): string {
        return faker.person.firstName();
    }

    static getLastName(): string {
        return faker.person.lastName();
    }

    static getFullName(): string {
        return faker.person.fullName();
    }

    static getEmail(): string {
        return faker.internet.email().toLowerCase();
    }

    static getPhoneNumber(): string {
        return faker.phone.number();
        // or to control format:
        // return faker.string.numeric(10);  // e.g. "9876543210"
    }


    static getSSN(): string {
        // generate format like "123-45-6789"
        const ssn = `${faker.string.numeric(3)}-${faker.string.numeric(2)}-${faker.string.numeric(4)}`;
        return ssn;
    }

    // -------------------- ADDRESS / LOCATION --------------------

    static getPinCode(): string {
        return faker.location.zipCode();
    }

    static getCity(): string {
        return faker.location.city();
    }

    static getState(): string {
        return faker.location.state();
    }

    static getCountry(): string {
        return faker.location.country();
    }

    static getAddress(): object {
        return {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
            zipCode: faker.location.zipCode(),
        };
    }

    static getGeoLocation(): object {
        return {
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
        };
    }

    // -------------------- TEXT / LOREM DATA --------------------

    /**
     * Generate a random title, useful for articles, claim subjects, etc.
     */
    static getTitle(): string {
        return faker.lorem.sentence(5);
    }

    /**
     * Generate a random short description
     */
    static getDescription(): string {
        return faker.lorem.sentences(2);
    }

    /**
     * Generate a random paragraph body text
     */
    static getBody(): string {
        return faker.lorem.paragraphs(2);
    }

    // -------------------- AUTO INSURANCE SPECIFIC DATA --------------------

    /**
     * Generate realistic driver details
     */
    static getDriverDetails(): object {
        return {
            firstName: this.getFirstName(),
            lastName: this.getLastName(),
            ssn: this.getSSN(),
            phone: this.getPhoneNumber(),
            email: this.getEmail(),
            address: this.getAddress(),
            licenseNumber: faker.string.alphanumeric(10).toUpperCase(),
            licenseState: this.getState(),
            dateOfBirth: faker.date.birthdate({ min: 1970, max: 2000, mode: 'year' }).toISOString().split('T')[0],
        };
    }

    /**
     * Generate realistic vehicle details
     */
    static getVehicleDetails(): object {
        return {
            make: faker.vehicle.manufacturer(),
            model: faker.vehicle.model(),
            year: faker.number.int({ min: 2000, max: 2025 }),
            vin: faker.vehicle.vin(),
            licensePlate: faker.vehicle.vrm(),
            color: faker.color.human(),
        };
    }

    /**
     * Generate realistic policy details
     */
    static getPolicyDetails(): object {
        const startDate = faker.date.recent({ days: 10 });
        const endDate = faker.date.future({ years: 1, refDate: startDate });

        return {
            policyNumber: `POL${faker.string.numeric(8)}`,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            premiumAmount: faker.finance.amount({ min: 500, max: 5000, dec: 2 }),
            coverageType: faker.helpers.arrayElement(['Liability', 'Comprehensive', 'Collision', 'Full Coverage']),
            active: true,
        };
    }

    /**
     * Generate realistic violation details
     */
    static getViolationDetails(): object {
        return {
            violationType: faker.helpers.arrayElement(['Speeding', 'Signal Jump', 'Seatbelt', 'Drunk Driving']),
            date: faker.date.past({ years: 2 }).toISOString().split('T')[0],
            location: this.getCity(),
            fineAmount: faker.finance.amount({ min: 50, max: 500, dec: 2 }),
        };
    }

    // -------------------- COMPOSITE OBJECTS --------------------

    /**
     * Generate a complete user/driver profile
     */
    static getUserProfile(): object {
        return {
            firstName: this.getFirstName(),
            lastName: this.getLastName(),
            email: this.getEmail(),
            phone: this.getPhoneNumber(),
            ssn: this.getSSN(),
            address: this.getAddress(),
        };
    }

    /**
     * Generate full auto insurance customer object
     */
    static getInsuranceCustomer(): object {
        return {
            driver: this.getDriverDetails(),
            vehicle: this.getVehicleDetails(),
            policy: this.getPolicyDetails(),
            violations: [this.getViolationDetails()],
        };
    }
}
