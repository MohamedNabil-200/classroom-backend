import { and, eq, getTableColumns, ilike, or, sql, SQL } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema/app.js";
import { db } from "../db/index.js";
import { date } from "drizzle-orm/mysql-core";

const router = express.Router();

// Get All Subjects with optional Search, Filters and Pagination
router.get("/", async (req, res) => {
  try {
    const { search, department } = req.query;
    const rawPage = Number.parseInt(String(req.query.page ?? "1"), 10);
    const rawLimit = Number.parseInt(String(req.query.limit ?? "10"), 10);
    const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
    const limitPerPage =
      Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 10;

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions: (SQL<unknown> | undefined)[] = [];

    //If Search Query exists, filter by subject name or code
    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }

    //If Department Query exists, filter by department
    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    // Combine all filter conditions using AND operator
    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const subjectsList = await db
      .select({
        ...getTableColumns(subjects),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        page: currentPage,
        total: totalCount,
        limit: limitPerPage,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error(`Get/subjects Error: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
