-- CreateTable
CREATE TABLE "users" (
    "id" CHAR(6) NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "email" TEXT,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "teacherId" CHAR(6) NOT NULL,
    "salary" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studyDepartmentId" CHAR(6) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("teacherId")
);

-- CreateTable
CREATE TABLE "studydepartments" (
    "id" CHAR(6) NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deanId" CHAR(6) NOT NULL,

    CONSTRAINT "studydepartments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "majors" (
    "id" CHAR(6) NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deanId" CHAR(6) NOT NULL,
    "studyDepartmentId" CHAR(6) NOT NULL,

    CONSTRAINT "majors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "StudentId" CHAR(6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "majorId" CHAR(6) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("StudentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "studydepartments_deanId_key" ON "studydepartments"("deanId");

-- CreateIndex
CREATE UNIQUE INDEX "majors_deanId_key" ON "majors"("deanId");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_studyDepartmentId_fkey" FOREIGN KEY ("studyDepartmentId") REFERENCES "studydepartments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studydepartments" ADD CONSTRAINT "studydepartments_deanId_fkey" FOREIGN KEY ("deanId") REFERENCES "teachers"("teacherId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "majors" ADD CONSTRAINT "majors_deanId_fkey" FOREIGN KEY ("deanId") REFERENCES "teachers"("teacherId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "majors" ADD CONSTRAINT "majors_studyDepartmentId_fkey" FOREIGN KEY ("studyDepartmentId") REFERENCES "studydepartments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
