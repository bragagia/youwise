# Hey Professor

## Tables

### accounts

- id: uuid
- name: string

### ressources

- id: uuid
- created_by_account_id: fkey
- private: boolean
- ressource_type: string
- url: string
- content: string

### hosted_files

- id: uuid (format will depend on hosting id)
- created_by_account_id: fkey
- ressource_id: fkey

### questions

- id: uuid
- ressource_id: fkey
- question: string (markdown) // eg: What is the hight of the Eiffel tower?
- answer: string (markdown) // eg: The Eiffel tower is 320m high

### memory

- id: uuid
- question_id: fkey
- memory_status: memory_status_enum
- interval: int nullable
- ease: float
- step: int

memory_status_enum = ["learning", "reviewing", "relearning"]
