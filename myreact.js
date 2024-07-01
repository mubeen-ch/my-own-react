const createElement = (type, props, ...child) => ({
    type,
    props: {
        ...props,
        child: child.map(child =>
            typeof child === 'object' ? child : createmyTextElement(child)
        ),
    },
});
const createmyTextElement = (text) => ({
    type: 'TEXT',
    props: {
        nodeValue: text,
        child: [],
    },
});
const render = (element, container) => {
    container.innerHTML = '';
    container.appendChild(createDOMElement(element));
};
const createDOMElement = (virtualdom) => {
    if (virtualdom.type === 'TEXT') {
        return document.createTextNode(virtualdom.props.nodeValue);
    }

    const dom = document.createElement(virtualdom.type);
    updateDOMProperties(dom, {}, virtualdom.props);

    virtualdom.props.child.forEach(child => {
        dom.appendChild(createDOMElement(child));
    });

    return dom;
};
const updateDOMProperties = (dom, prevProps, nextProps) => {
    Object.keys(prevProps)
        .filter(name => name !== 'children' && nextProps[name] !== prevProps[name])
        .forEach(name => {
            if (name.startsWith('on')) {
                const eventType = name.toLowerCase().substring(2);
                dom.removeEventListener(eventType, prevProps[name]);
            } else {
                dom[name] = '';
            }
        });
        Object.keys(nextProps)
        .filter(name => name !== 'children' && nextProps[name] !== prevProps[name])
        .forEach(name => {
            if (name.startsWith('on')) {
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, nextProps[name]);
            } else {
                dom[name] = nextProps[name];
            }
        });
};
const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email } = e.target.elements;
    const info = { name: name.value, email: email.value };
    const storedInfo = JSON.parse(sessionStorage.getItem('info')) || [];
    storedInfo.push(info);
    sessionStorage.setItem('info', JSON.stringify(storedInfo));

    name.value = '';
    email.value = '';
    updateDisplay();
};

const updateDisplay = () => {
    const storedInfo = JSON.parse(sessionStorage.getItem('info')) || [];
    const handleEdit = (index) => (e) => {
        const newName = prompt('Enter new name:', storedInfo[index].name);
        const newEmail = prompt('Enter new email:', storedInfo[index].email);

      
        if (newName !== null && newEmail !== null) {
            storedInfo[index].name = newName;
            storedInfo[index].email = newEmail;
            sessionStorage.setItem('info', JSON.stringify(storedInfo));
            updateDisplay();
        }
    };
    const infoList = storedInfo.map((info, index) =>
        createElement('div', { className: 'info-item' },
            createElement('p', null, `Name: ${info.name}`),
            createElement('p', null, `Email: ${info.email}`),
            createElement('button', { onClick: handleEdit(index) }, 'Edit')
        )
    );
    const app = createElement('div', null,
        createElement('h1', null, 'Stored Info'),
        createElement('form', { onSubmit: handleSubmit },
            createElement('label', null, 'Name: ',
                createElement('input', { type: 'text', name: 'name', placeholder: 'Enter name' })
            ),
            createElement('br'),
            createElement('label', null, 'Email: ',
                createElement('input', { type: 'email', name: 'email', placeholder: 'Enter email' })
            ),
            createElement('br'),
            createElement('button', { type: 'submit' }, 'Add')
        ),
        createElement('div', { id: 'info-list' }, ...infoList)
    );

    render(app, document.getElementById('root'));
};
updateDisplay();