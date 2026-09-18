# Hospital Management System

A full-stack Hospital Management System developed as a DBMS project
using **Oracle Database**, **Spring Boot**, and a **Vanilla
HTML/CSS/JavaScript frontend**.

The system provides a centralized dashboard for managing patients,
doctors, hospitals, consultations, payments, prescriptions, medicines,
tests, feedback, medical records, and their relationships. All displayed
data is retrieved dynamically from the Oracle database through backend
REST APIs.

------------------------------------------------------------------------

## 1. Project Overview

The Hospital Management System is designed to demonstrate the practical
use of:

-   Relational database design
-   Primary and foreign keys
-   Constraints
-   One-to-one and many-to-many relationships
-   SQL queries and joins
-   Aggregate functions
-   Indexes
-   Database sequences
-   PL/SQL procedures
-   JDBC connectivity
-   REST APIs
-   CRUD operations
-   Dynamic frontend integration
-   Dashboard-based data visualization

The application follows a three-layer flow:

``` text
Frontend
   ↓
REST API
   ↓
Spring Boot Backend
   ↓
JdbcTemplate / JDBC
   ↓
Oracle Database
```

The frontend does not directly access Oracle. The backend acts as the
interface between the UI and database.

------------------------------------------------------------------------

# 2. Technology Stack

## Database

-   Oracle Database 26ai Free
-   Oracle SQL
-   PL/SQL
-   Database sequences
-   Constraints and indexes

## Backend

-   Java
-   Spring Boot 3.3.4
-   Spring Web
-   Spring JDBC
-   JdbcTemplate
-   Maven
-   Oracle JDBC Driver (`ojdbc11`)

## Frontend

-   HTML5
-   CSS3
-   JavaScript
-   Fetch API
-   Chart.js (where used for dashboard visualization)
-   Lucide icons (where used)

No React, Angular, Vue, or TypeScript is required.

------------------------------------------------------------------------

# 3. Main Functionalities

## 3.1 Dashboard

The dashboard provides a centralized view of hospital data.

Typical dashboard information includes:

-   Total patients
-   Total doctors
-   Total hospitals
-   Consultation information
-   Payment information
-   Doctor ratings
-   Consultation statistics
-   Other database-driven summaries

Charts and statistics are populated using backend API responses.

**Important:** Dashboard values are not hardcoded. They are obtained
from Oracle through the backend.

------------------------------------------------------------------------

# 4. Patient Management

The Patient Management module handles patient records.

### Patient information

-   Patient ID
-   First name
-   Last name
-   Date of birth
-   Gender
-   City
-   Area
-   Pincode

### Operations

-   View patients
-   Add patients
-   Update patients
-   Delete patients
-   View patient-related information

Patient phone numbers are maintained separately through the
`PATIENT_PHONE` table because a patient can have multiple phone numbers.

------------------------------------------------------------------------

# 5. Doctor Management

The Doctor Management module stores and manages doctor information.

### Doctor information

-   Doctor ID
-   First name
-   Last name
-   Gender
-   Date of birth
-   Date joined
-   License number
-   Experience

Additional doctor-related information is maintained using separate
tables:

-   Doctor phone numbers
-   Qualifications
-   Ratings
-   Specializations
-   Hospital assignments

### Supported specializations

The database supports:

-   General Physician
-   Cardiologist
-   Neurologist
-   Dermatologist
-   Psychiatrist

### Operations

-   View doctors
-   Add doctors
-   Update doctors
-   Delete doctors
-   View doctor-related details

------------------------------------------------------------------------

# 6. Hospital Management

The Hospital Management module manages hospital information.

### Hospital information

-   Hospital ID
-   Hospital name
-   Street
-   Area
-   City
-   Pincode

Hospital contact numbers are stored separately in `HOSPITAL_PHONE`.

Doctors associated with hospitals are maintained through
`HOSPITAL_DOCTOR`.

### Operations

-   View hospitals
-   Add hospitals
-   Update hospitals
-   Delete hospitals
-   Manage hospital-doctor relationships

------------------------------------------------------------------------

# 7. Consultation Management

The Consultation module manages appointments/consultations between
patients and doctors.

### Consultation information

-   Consultation ID
-   Patient ID
-   Doctor ID
-   Booking date
-   Consultation date
-   Start time
-   End time
-   Status
-   Consultation mode
-   Video link
-   Call number
-   Chat transcript ID

### Consultation modes

The database supports:

-   VIDEO
-   AUDIO
-   CHAT

### Operations

-   View consultations
-   Add consultations
-   Update consultations
-   Delete consultations
-   Update consultation status
-   View patient-doctor consultation relationships

The consultation table connects patients and doctors and acts as one of
the central transaction tables in the system.

------------------------------------------------------------------------

# 8. Payment Management

The Payment module stores payment information associated with
consultations.

### Payment information

-   Payment ID
-   Consultation ID
-   Payment amount
-   Payment method

### Supported payment methods

-   COD
-   UPI
-   CARD
-   NETBANKING

### Operations

-   View payments
-   Add payments
-   Update payments
-   Delete payments

Payment data can also be used for dashboard summaries and aggregate
analysis.

------------------------------------------------------------------------

# 9. Prescription Management

Prescriptions are associated with consultations.

### Prescription information

-   Prescription ID
-   Consultation ID
-   Prescription date
-   Dosage

A prescription can contain multiple medicines and tests.

The relationships are represented using:

-   `PRESCRIPTION_MEDICINE`
-   `PRESCRIPTION_TEST`

### Operations

-   View prescriptions
-   Add prescriptions
-   Update prescriptions
-   Delete prescriptions
-   Associate medicines with prescriptions
-   Associate tests with prescriptions

------------------------------------------------------------------------

# 10. Medicine Management

The Medicine module stores medicines that can be included in
prescriptions.

### Medicine information

-   Medicine ID
-   Medicine name
-   Medicine type

### Supported medicine types

-   DRUG
-   INJECTION
-   TABLET
-   SYRUP

### Operations

-   View medicines
-   Add medicines
-   Update medicines
-   Delete medicines

------------------------------------------------------------------------

# 11. Test Management

The Test module stores medical tests that can be associated with
prescriptions.

### Test information

-   Test ID
-   Test name
-   Test type

### Supported test types

-   BLOOD_TEST
-   X_RAY
-   URINE_TEST
-   ECG

### Operations

-   View tests
-   Add tests
-   Update tests
-   Delete tests

------------------------------------------------------------------------

# 12. Feedback Management

Patients can have feedback records associated with them.

### Feedback information

-   Feedback ID
-   Patient ID
-   Feedback comment
-   Rating

Rating is constrained to a value between **1 and 5**.

The Oracle column is intentionally named:

``` text
feedback_comment
```

This is used instead of the reserved/ambiguous column name `comment`.

------------------------------------------------------------------------

# 13. Medical Records

The `MEDICAL_RECORD` table stores patient medical information.

### Information stored

-   Medical record ID
-   Patient ID
-   Symptoms
-   Diagnoses

This allows medical information to remain associated with the relevant
patient.

------------------------------------------------------------------------

# 14. Database Relationships

The database uses normalized tables and relationship tables to represent
real-world hospital relationships.

Major relationships include:

``` text
PATIENT
  ├── PATIENT_PHONE
  ├── FEEDBACK
  ├── MEDICAL_RECORD
  └── CONSULTATION
             │
             └── DOCTOR
                  ├── DOCTOR_PHONE
                  ├── DOCTOR_QUALIFICATION
                  ├── DOCTOR_RATING
                  └── DOCTOR_SPECIALIZATION

HOSPITAL
  ├── HOSPITAL_PHONE
  └── HOSPITAL_DOCTOR
             │
             └── DOCTOR

CONSULTATION
  ├── PAYMENT
  └── PRESCRIPTION
          ├── PRESCRIPTION_MEDICINE → MEDICINE
          └── PRESCRIPTION_TEST → TEST
```

Relationship tables are used where appropriate for many-to-many
relationships.

------------------------------------------------------------------------

# 15. Database Tables

The project contains **19 tables**:

1.  `PATIENT`
2.  `PATIENT_PHONE`
3.  `FEEDBACK`
4.  `MEDICAL_RECORD`
5.  `DOCTOR`
6.  `DOCTOR_PHONE`
7.  `DOCTOR_QUALIFICATION`
8.  `DOCTOR_RATING`
9.  `DOCTOR_SPECIALIZATION`
10. `HOSPITAL`
11. `HOSPITAL_PHONE`
12. `HOSPITAL_DOCTOR`
13. `CONSULTATION`
14. `PAYMENT`
15. `PRESCRIPTION`
16. `MEDICINE`
17. `PRESCRIPTION_MEDICINE`
18. `TEST`
19. `PRESCRIPTION_TEST`

------------------------------------------------------------------------

# 16. Database Scripts

The `database/` directory contains the SQL and PL/SQL scripts.

``` text
database/
├── 01_schema.sql
├── 02_constraints.sql
├── 03_indexes.sql
├── 04_seed_data.sql
├── 05_queries.sql
├── 06_plsql.sql
├── 07_sequences.sql
└── README.md
```

## 16.1 Schema

`01_schema.sql`

Creates the 19 relational tables.

It defines the base table structures and their columns.

------------------------------------------------------------------------

## 16.2 Constraints

`02_constraints.sql`

Adds database constraints such as:

-   Primary keys
-   Foreign keys
-   Unique constraints
-   Check constraints
-   Required fields

Examples include:

-   Gender validation
-   Rating range validation
-   Consultation mode validation
-   Payment method validation
-   Medicine type validation
-   Test type validation
-   Positive payment amount
-   Non-negative doctor experience

------------------------------------------------------------------------

## 16.3 Indexes

`03_indexes.sql`

Creates indexes to improve query performance for frequently searched or
joined columns.

------------------------------------------------------------------------

## 16.4 Seed Data

`04_seed_data.sql`

Populates the database with initial sample data.

The seeded database contains records for:

-   Patients
-   Doctors
-   Hospitals
-   Consultations
-   Payments
-   Prescriptions
-   Medicines
-   Tests
-   Related entities

The current verified seed data includes:

-   6 patients
-   5 doctors
-   7 consultations

------------------------------------------------------------------------

## 16.5 SQL Queries

`05_queries.sql`

Contains demonstration and analytical SQL queries involving:

-   Patient information
-   Consultation information
-   Payment summaries
-   Doctor consultation counts
-   Doctor specialization and ratings
-   Hospital-doctor relationships
-   Prescription-medicine relationships
-   Joins across multiple tables
-   Aggregate functions

These queries demonstrate how the relational database can be used for
both transactional and analytical operations.

------------------------------------------------------------------------

## 16.6 PL/SQL

`06_plsql.sql`

Contains stored procedures used for database-side operations.

The project includes:

### `ADD_FEEDBACK`

Adds feedback for a patient.

### `SHOW_PATIENT_CONSULTATIONS`

Displays consultations associated with a patient.

### `UPDATE_CONSULTATION_STATUS`

Updates the status of a consultation.

The procedures were verified as valid in Oracle.

------------------------------------------------------------------------

## 16.7 Sequences

`07_sequences.sql`

Creates sequences used for generating IDs for major entities.

Sequences include:

``` text
SEQ_CONSULTATION
SEQ_DOCTOR
SEQ_FEEDBACK
SEQ_HOSPITAL
SEQ_MEDICAL_RECORD
SEQ_MEDICINE
SEQ_PATIENT
SEQ_PAYMENT
SEQ_PRESCRIPTION
SEQ_TEST
```

These sequences allow new records to receive database-generated IDs
without manually selecting the next ID.

------------------------------------------------------------------------

# 17. Backend Architecture

The backend follows a layered architecture.

``` text
Controller
    ↓
Service
    ↓
Repository
    ↓
JdbcTemplate
    ↓
Oracle Database
```

## Controller Layer

Handles HTTP requests and responses.

Examples of operations:

``` text
GET
POST
PUT
DELETE
```

## Service Layer

Contains application-level logic and connects controllers with
repositories.

## Repository Layer

Contains SQL queries and uses `JdbcTemplate` to communicate with Oracle.

## Model / DTO Layer

Represents database entities and request/response data.

## Exception Handling

The backend contains centralized exception handling for API errors.

------------------------------------------------------------------------

# 18. REST API

The backend runs on:

``` text
http://localhost:8080
```

Major API resources include:

``` text
/api/patients
/api/doctors
/api/hospitals
/api/consultations
/api/payments
/api/prescriptions
/api/medicines
/api/tests
```

Additional endpoints support:

-   Patient phone numbers
-   Doctor phone numbers
-   Doctor qualifications
-   Doctor ratings
-   Doctor specializations
-   Hospital phone numbers
-   Hospital-doctor relationships
-   Feedback
-   Medical records
-   Prescription-medicine relationships
-   Prescription-test relationships

Exact routes should be checked in the corresponding Spring Boot
controllers.

------------------------------------------------------------------------

# 19. CRUD Operations

The system supports CRUD operations for the main entities.

### Create

Adds a new record to Oracle.

### Read

Retrieves records through REST APIs.

### Update

Modifies an existing database record.

### Delete

Removes an existing record where supported by the database relationships
and backend.

The frontend communicates with these APIs using JavaScript `fetch()`
requests.

------------------------------------------------------------------------

# 20. Dynamic Frontend

The frontend is intentionally database-driven.

The frontend does **not** contain hardcoded patient, doctor, hospital,
consultation, or other database records.

Instead:

``` text
Frontend JavaScript
       ↓
fetch()
       ↓
Spring Boot REST API
       ↓
JdbcTemplate
       ↓
Oracle
       ↓
JSON response
       ↓
Frontend UI
```

This means that when database data changes, the UI can retrieve the
updated information from the backend.

------------------------------------------------------------------------

# 21. Configuration

The backend uses environment variables for database configuration.

Example:

``` powershell
$env:DB_URL="jdbc:oracle:thin:@localhost:1521/FREEPDB1"
$env:DB_USERNAME="C##STUDENT"
$env:DB_PASSWORD="YOUR_PASSWORD"
$env:FRONTEND_ORIGIN="http://localhost:5500"
```

Do not commit database passwords to GitHub.

The application configuration uses these environment variables instead
of requiring credentials to be hardcoded in source code.

------------------------------------------------------------------------

# 22. Prerequisites

Install the following:

-   Oracle Database 26ai Free
-   Java JDK 17 or later
-   Maven 3.x
-   A modern web browser
-   Git

The project currently targets Java 17 in Maven while also working in the
development environment with Java 21.

------------------------------------------------------------------------

# 23. Database Setup

Connect to the Oracle PDB and run the database scripts in this order:

``` text
01_schema.sql
02_constraints.sql
03_indexes.sql
04_seed_data.sql
05_queries.sql
06_plsql.sql
07_sequences.sql
```

The scripts should be executed in order because later scripts depend on
objects created earlier.

Make sure the Oracle user has sufficient quota on the `USERS`
tablespace.

------------------------------------------------------------------------

# 24. Running the Backend

Navigate to:

``` powershell
cd backend
```

Set the database environment variables:

``` powershell
$env:DB_URL="jdbc:oracle:thin:@localhost:1521/FREEPDB1"
$env:DB_USERNAME="C##STUDENT"
$env:DB_PASSWORD="YOUR_PASSWORD"
$env:FRONTEND_ORIGIN="http://localhost:5500"
```

Compile:

``` powershell
mvn clean compile
```

Run:

``` powershell
mvn spring-boot:run
```

The backend should start at:

``` text
http://localhost:8080
```

------------------------------------------------------------------------

# 25. Testing the Backend

A simple API test can be performed using PowerShell:

``` powershell
Invoke-RestMethod http://localhost:8080/api/patients
```

Or using curl:

``` powershell
curl.exe http://localhost:8080/api/patients
```

A successful response should contain patient records retrieved from
Oracle.

Other major endpoints can be tested similarly:

``` powershell
curl.exe http://localhost:8080/api/doctors
curl.exe http://localhost:8080/api/hospitals
curl.exe http://localhost:8080/api/consultations
curl.exe http://localhost:8080/api/payments
curl.exe http://localhost:8080/api/prescriptions
curl.exe http://localhost:8080/api/medicines
curl.exe http://localhost:8080/api/tests
```

------------------------------------------------------------------------

# 26. Running the Frontend

The frontend is located in:

``` text
frontend/
```

It contains the HTML, CSS, and JavaScript required for the dashboard.

A simple local server can be started from the frontend directory using
Python:

``` powershell
python -m http.server 5500
```

Then open:

``` text
http://localhost:5500
```

The frontend communicates with the backend running on port `8080`.

------------------------------------------------------------------------

# 27. CORS

The backend allows the configured frontend origin.

Default development origin:

``` text
http://localhost:5500
```

The origin can be changed through:

``` text
FRONTEND_ORIGIN
```

This allows the frontend development server and backend server to
communicate while running on different ports.

------------------------------------------------------------------------

# 28. Data Integrity

The database enforces data integrity through:

-   Primary keys
-   Foreign keys
-   Unique constraints
-   Check constraints
-   Not-null constraints
-   Relationship tables

Examples:

``` text
Patient_ID → identifies a unique patient
Doctor_ID → identifies a unique doctor
Consultation_ID → identifies a unique consultation
Payment → references a consultation
Prescription → references a consultation
Prescription_Medicine → connects prescriptions and medicines
Prescription_Test → connects prescriptions and tests
```

This prevents invalid relationships and helps maintain consistency.

------------------------------------------------------------------------

# 29. Normalization and Database Design

The database separates repeating and multi-valued information into
dedicated tables.

For example:

``` text
PATIENT
PATIENT_PHONE
```

rather than storing multiple phone numbers in one patient row.

Similarly:

``` text
DOCTOR
DOCTOR_PHONE
DOCTOR_QUALIFICATION
DOCTOR_SPECIALIZATION
```

This reduces redundancy and supports normalized relational design.

Relationship tables such as:

``` text
HOSPITAL_DOCTOR
PRESCRIPTION_MEDICINE
PRESCRIPTION_TEST
```

represent relationships between entities without duplicating entity
information.

------------------------------------------------------------------------

# 30. Important Oracle Compatibility Details

The database contains two columns that require special handling in the
Java backend.

## Consultation `"Date"`

The Oracle column is literally:

``` text
"Date"
```

Because it is a quoted identifier, Java SQL strings must escape the
quotation marks:

``` java
"SELECT \"Date\" FROM consultation"
```

However, ResultSet access remains:

``` java
rs.getDate("Date")
```

## Feedback `feedback_comment`

The feedback text column is:

``` text
feedback_comment
```

The backend should use this exact database column name in SQL.

------------------------------------------------------------------------

# 31. Security and Credentials

Database credentials should be supplied through environment variables.

Do not commit:

``` text
DB_PASSWORD
```

or any real database credentials into source control.

For development, credentials can be configured in the terminal session
before starting Spring Boot.

------------------------------------------------------------------------

# 32. Project Structure

``` text
Telemedical_platform/
│
├── database/
│   ├── 01_schema.sql
│   ├── 02_constraints.sql
│   ├── 03_indexes.sql
│   ├── 04_seed_data.sql
│   ├── 05_queries.sql
│   ├── 06_plsql.sql
│   ├── 07_sequences.sql
│   └── README.md
│
├── backend/
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/hospital/dashboard/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── exception/
│   │   │   │       ├── model/
│   │   │   │       ├── repository/
│   │   │   │       ├── service/
│   │   │   │       └── HospitalDashboardApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── target/
│
└── frontend/
    ├── index.html
    ├── css/
    └── js/
```

------------------------------------------------------------------------

# 33. Current Development Status

The database layer has been created and tested.

Verified components include:

-   19-table Oracle schema
-   Constraints
-   Indexes
-   Seed data
-   SQL query script
-   PL/SQL procedures
-   Database sequences
-   Oracle connectivity
-   Spring Boot startup
-   Patient REST API
-   Dynamic retrieval of patient data

The backend is being validated across its remaining API modules before
final frontend integration.

------------------------------------------------------------------------

# 34. Design Principles

The project follows these principles:

### Database-driven application

The database is the source of application data.

### Separation of concerns

Database, backend, and frontend are maintained as separate layers.

### API-based communication

The frontend communicates with the database only through REST APIs.

### Reusable backend architecture

Controllers, services, and repositories have separate responsibilities.

### Relational integrity

Foreign keys and constraints maintain relationships between entities.

### No hardcoded database records

Patient, doctor, hospital, consultation, payment, prescription,
medicine, and test information is retrieved dynamically.

------------------------------------------------------------------------

# 35. Git Workflow

The project can be maintained using separate branches for different
modules.

Example:

``` text
main
├── database
├── backend
└── frontend
```

Each team member can work primarily within their assigned directory and
merge changes into the main branch after testing.

Before committing:

``` powershell
git status
git add .
git commit -m "Describe your changes"
git push
```

------------------------------------------------------------------------

# 36. Troubleshooting

## Backend does not start

Check whether port `8080` is already being used.

Windows:

``` powershell
netstat -ano | findstr :8080
```

If another process is using the port, stop that process or configure
another port.

------------------------------------------------------------------------

## Oracle connection fails

Verify:

-   Oracle Database is running
-   `FREEPDB1` is open
-   Username is correct
-   Password is correct
-   `DB_URL` is correct

Expected development URL:

``` text
jdbc:oracle:thin:@localhost:1521/FREEPDB1
```

------------------------------------------------------------------------

## API returns HTTP 500

Check the Spring Boot terminal for the underlying Oracle/JDBC exception.

Common causes include:

-   Incorrect SQL column name
-   Incorrect Oracle identifier quoting
-   Incorrect Java/JDBC type mapping
-   Database constraint violation
-   Invalid foreign key value
-   Incorrect sequence usage

------------------------------------------------------------------------

## Frontend cannot reach backend

Verify:

``` text
Frontend → http://localhost:5500
Backend  → http://localhost:8080
```

Then check the backend's CORS configuration and browser developer
console.

------------------------------------------------------------------------

# 37. Academic Concepts Demonstrated

This project demonstrates the following DBMS concepts:

-   ER-style relational modeling
-   Relational schema design
-   Primary keys
-   Foreign keys
-   Candidate/unique constraints
-   Check constraints
-   Not-null constraints
-   Normalization
-   One-to-one relationships
-   One-to-many relationships
-   Many-to-many relationships
-   Joins
-   Aggregate functions
-   Indexing
-   Sequences
-   SQL DML
-   SQL DDL
-   PL/SQL
-   Stored procedures
-   JDBC
-   Database connectivity
-   Transaction-oriented entities
-   REST API integration
-   Dynamic database-driven UI

------------------------------------------------------------------------

# 38. Summary

The Hospital Management System integrates an Oracle relational database
with a Spring Boot REST backend and a dynamic web dashboard.

The system supports management of:

``` text
Patients
Doctors
Hospitals
Consultations
Payments
Prescriptions
Medicines
Tests
Feedback
Medical Records
```

along with phone numbers, qualifications, ratings, specializations,
hospital-doctor relationships, and prescription relationships.

The overall architecture is:

``` text
                 HOSPITAL MANAGEMENT SYSTEM

                        FRONTEND
                    HTML / CSS / JS
                          │
                          │ REST / Fetch
                          ▼
                    SPRING BOOT
                 Controller → Service
                          │
                          ▼
                    JdbcTemplate
                          │
                          ▼
                    ORACLE 26ai
                          │
              ┌───────────┴───────────┐
              │                       │
        19 Relational Tables     PL/SQL Procedures
              │
        SQL / Constraints
        Indexes / Sequences
              │
              ▼
          Hospital Data
```

The project demonstrates how a normalized Oracle database can be
integrated with a Java Spring Boot backend and a dynamic web interface
to create a complete database-driven hospital management application.
