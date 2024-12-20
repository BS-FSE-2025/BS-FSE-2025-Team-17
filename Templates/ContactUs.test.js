import { render, screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('בדיקות לדף יצירת קשר', () => {
    let container;
    
    beforeEach(() => {
        container = render(`
            <div>
                <h1>יצירת קשר</h1>
                <form id="contactForm">
                    <input 
                        type="text" 
                        placeholder="הזן את השם שלך כאן" 
                        id="name"
                        required 
                    />
                    <input 
                        type="text" 
                        placeholder="הזן את מספר הטלפון/הדואל שלך כאן" 
                        id="phone"
                        required 
                    />
                    <textarea 
                        placeholder="הזן את תוכן הפנייה שלך כאן" 
                        id="content"
                        required
                    ></textarea>
                    <button type="submit">שלח בקשה</button>
                    <img alt="talkwithus" src="path/to/image.jpg" />
                </form>
            </div>
        `).container;
        
        document.body.appendChild(container);
    });

    test('אלמנטים בדף נטענים כראוי', () => {
        expect(screen.getByText('יצירת קשר')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('הזן את השם שלך כאן')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('הזן את מספר הטלפון/הדואל שלך כאן')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('הזן את תוכן הפנייה שלך כאן')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'שלח בקשה' })).toBeInTheDocument();
        expect(screen.getByAltText('talkwithus')).toBeInTheDocument();
    });

    test('שדות חובה לא מאפשרים לשלוח טופס ריק', () => {
        const form = screen.getByRole('form');
        const submitButton = screen.getByRole('button', { name: 'שלח בקשה' });
        
        fireEvent.submit(form);
        
        expect(screen.getByPlaceholderText('הזן את השם שלך כאן')).toBeRequired();
        expect(screen.getByPlaceholderText('הזן את מספר הטלפון/הדואל שלך כאן')).toBeRequired();
        expect(screen.getByPlaceholderText('הזן את תוכן הפנייה שלך כאן')).toBeRequired();
    });

    test('מילוי הטופס ושליחה תקינה', async () => {
        const nameInput = screen.getByPlaceholderText('הזן את השם שלך כאן');
        const phoneInput = screen.getByPlaceholderText('הזן את מספר הטלפון/הדואל שלך כאן');
        const contentInput = screen.getByPlaceholderText('הזן את תוכן הפנייה שלך כאן');
        const form = screen.getByRole('form');

        fireEvent.change(nameInput, { target: { value: 'יוסי ישראלי' } });
        fireEvent.change(phoneInput, { target: { value: '0501234567' } });
        fireEvent.change(contentInput, { target: { value: 'זוהי הודעת בדיקה' } });

        expect(nameInput).toHaveValue('יוסי ישראלי');
        expect(phoneInput).toHaveValue('0501234567');
        expect(contentInput).toHaveValue('זוהי הודעת בדיקה');

        // Mock submit event
        const mockSubmit = jest.fn(e => e.preventDefault());
        form.addEventListener('submit', mockSubmit);
        
        fireEvent.submit(form);
        expect(mockSubmit).toHaveBeenCalled();
    });

    afterEach(() => {
        container.remove();
        jest.clearAllMocks();
    });
});