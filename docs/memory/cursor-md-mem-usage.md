# Cursor MD Mem - Usage

This server serves as a memory system for the Cursor AI Assistant since it has no memory between chat- or agent-sessions. It stores and manages 
Markdown notes that contain knowledge gathered during a session. Through note linking, a knowledge network emerges that helps to understand relationships 
and dependencies between different aspects of the project.

## Available Tools:
- search_notes(query): Search for notes
- read_note(title): Read a specific note
- write_note(markdown): Create/update a note
- link_notes(title1, title2): Link two notes together
- unlink_notes(title1, title2): Remove a link
- delete_note(title): Delete a note
- list_notes(): List all available notes
- get_current_date(format): Get current date/time in various formats
  - "iso": 2024-01-15T14:30:45 (default)
  - "date": 2024-01-15
  - "datetime": January 15, 2024 2:30 PM
  - "timestamp": 1705339845
  - "german": 15.01.2024 14:30
- get_usage_info(): Show this help

## Instructions:
1. Before starting any task:
   - Search for relevant notes using specific keywords
   - Read found notes and follow their links
   - Check linked notes for additional context
2. Use `write_note` to store important project knowledge:
   - Technical decisions and their rationale
   - Architecture and design patterns
   - Project conventions and standards
   - API documentation and usage examples
   - External knowledge sources (docs, links)
   - Solutions to complex problems
3. After completing a task:
   - Review what new knowledge was gained
   - Check if existing notes need updates
   - Create new notes for unique topics
   - Link new notes to related existing ones
4. Use descriptive titles that reflect the note's content
5. Link related notes using `[[Title]]` syntax to build a knowledge network
6. Follow note links to gather deeper understanding of related topics
7. Search notes with `search_notes` before asking questions
8. Use `get_current_date()` to add accurate timestamps to notes
9. Use `get_usage_info` to see this help

## Note Conventions:
- Each note focuses on a single topic or concept
- Update existing notes instead of creating duplicates
- Structure notes with clear sections:
  - Purpose/Context
  - Main Content
  - Related Topics (as links)
  - Examples (if applicable)
  - References (external sources)
- Markdown files (.md)
- Wiki-style links using [[link]]
- Full-text search enabled
- Language: English