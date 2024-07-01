export const RadioInput = () => {
  return (
    <div className='flex-row' style={{ width: '100%', justifyContent: 'space-between' }}>
      <div
        className='group-btn'
        style={{
          borderRight: '1px solid #ccc',
          borderBottomLeftRadius: 5,
          borderTopLeftRadius: 5,
        }}
      >
        Basic
      </div>
      <div className='group-btn' style={{ borderRight: '1px solid #ccc' }}>
        Markdown
      </div>
      <div className='group-btn' style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
        Markdown & Maths
      </div>
    </div>
  );
};
