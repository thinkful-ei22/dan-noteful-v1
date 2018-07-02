-- Select all the notes
-- SELECT * FROM notes;

-- Select all the notes and limit by 5
-- SELECT * FROM notes limit 5;

-- Select all the notes and change the sort order. Experiment with sorting by id, title and date. Try both ascending and descending.
-- SELECT * FROM notes ORDER BY id DESC;
-- SELECT * FROM notes ORDER BY title ASC;
-- SELECT * FROM notes ORDER BY created DESC;

-- Select notes where title matches a string exactly
-- SELECT * FROM notes WHERE title = '10 ways cats can help you live to 100';

-- Select notes where title is LIKE a string. In other words the title contains the word or phrase (e.g cats or ways)
-- SELECT * FROM notes WHERE title LIKE '%gaga%';

-- Update the title and content of a specific note.
-- UPDATE notes
--   SET title = 'Lebron James Joins the LA Lakes', content = 'Historic moment for the NBA blah blah blah'
--   WHERE title LIKE '%learned from cats%';

-- Insert a new note. Try providing incomplete data like missing content or title fields.
-- INSERT INTO notes(
--   content) VALUES (
--     'this is my dummy content'
--   );

-- INSERT INTO notes(
--   title) VALUES (
--     'And this is my dummy title'
--   );

-- Delete a note by id
-- DELETE FROM notes WHERE id = 12;

-- Alter the sequence field so that the IDs start at 1000.
-- ALTER SEQUENCE notes_id_seq RESTART with 1000;


-- DELETE FROM notes;
-- SELECT * FROM notes;