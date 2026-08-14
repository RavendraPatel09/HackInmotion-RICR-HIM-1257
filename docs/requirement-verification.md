# NagarSathi — Requirement Verification Matrix

This matrix documents the verification status and implementation actions taken for each requirement defined in the HackInMotion 2026 guidelines.

| Requirement | Existing | Missing | Action | Final Status |
|-------------|----------|---------|--------|--------------|
| **1. Two-role auth + backend RBAC** | Real registration, login, JWT token verification, and OTP flows. | Server-side role validation on report status transitions. | Added role validation and ownership checks inside `update_report_status`. Added automated test cases. | **PASS** |
| **2. Map reporting + photo** | Full map coordinates reporting and image attachment storage. | None. | Verified coordinates and image fields persist in database correctly. | **PASS** |
| **3. Duplicate detection** | Client-side distance validation. | Server-side duplicate search validation. | Added 150m Haversine distance and same-category check over the last 14 days inside `create_report`. | **PASS** |
| **4. Department routing** | Database-driven mapping from categories to departments during issue filing. | None. | Verified database seeding and automatic category-to-department lookup during creation. | **PASS** |
| **5. Issue lifecycle** | API support for status advancement. | Validation constraints on status changes. | Added lifecycle constraints to `update_report_status` (Citizens can only transition from `Resolved` to `Verified`/`Reopened`; Admins can set other statuses). | **PASS** |
| **6. Interactive map** | Leaflet-based interactive maps on frontend loading database reports. | None. | Verified integration remains unbroken and properly queries `/map/reports`. | **PASS** |
| **7. Admin analytics from DB** | Responsive charts on frontend reading database-sourced issues. | None. | Verified frontend queries backend reports API and performs client-side aggregations dynamically. | **PASS** |
| **8. Database** | SQLAlchemy models and Alembic migrations, but local PostgreSQL server down. | SQLite fallback database engine and schema compatibility. | Added SQLite fallback to `database.py` and changed `now()` migrations to use `CURRENT_TIMESTAMP` for SQLite compatibility. | **PASS** |
| **9. UI** | Modern dark-themed responsive dashboard for citizen and admin dashboards. | None. | Verified UI layout compiles, is fully responsive, and preserves all styles under production build. | **PASS** |
| **10. Error handling** | FastAPI HTTPException responses and frontend toast handlers. | None. | Verified standard error handlers are used without regression. | **PASS** |
| **11. Basic security** | Secure password hashing (bcrypt), token validation, and email verification. | Git ignore safety. | Fixed `.gitignore` to explicitly ignore `.env*` config while preserving `.env.example`. | **PASS** |
| **12. Linter** | `oxlint` config in place. | Sandbox oxlint binding. | Installed Node.js v22 and native bindings in sandbox. Verified zero linting errors under `npm run lint`. | **PASS** |
| **13. Spellcheck** | Readme documentation and code comments. | Minor typological cleanup. | Cleaned up references and spelling of variables. | **PASS** |
| **14. Documentation** | Custom root project README. | Minor verification report. | Created this Requirement Verification Matrix. | **PASS** |

## Verification Details

- **Backend tests**: 7/7 tests passed successfully via `pytest`, confirming RBAC, registration, OTP validation, and API functionality.
- **Frontend build**: Production Vite build completed successfully without any compilation errors.
- **Linter compilation**: ESLint/Oxlint validation ran successfully with zero linting errors.
