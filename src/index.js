import React from 'react';
import ReactDOM from 'react-dom/client';
import 'reset-css';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

class App extends React.Component {
  state = initialData;
  //only required callback
  // onDragEnd = result => {
  //   //info interested in from result object
  //   const { destination, source, draggableId } = result;

  //   //if no destination, nothing to do
  //   if (!destination) {
  //     return;
  //   }
  //   //check if location of the draggable changed
  //   //user dropped item in same place where it started
  //   if (destination.droppableId === source.droppableId && destination.index === source.index) {
  //     return;
  //   }

  //   //have items persist when reordered
  //   const column = this.state.columns[source.droppableId];
  //   const newTaskIds = Array.from(column.taskIds);
  //   newTaskIds.splice(source.index, 1);
  //   newTaskIds.splice(destination.index, 0, draggableId);

  //   const newColumn = {
  //     ...column,
  //     taskIds: newTaskIds,
  //   };

  //   const newState = {
  //     ...this.state,
  //     columns: {
  //       ...this.state.columns,
  //       [newColumn.id]: newColumn,
  //     },
  //   };

  //   this.setState(newState);
  // };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {this.state.columnOrder.map(columnId => {
          const column = this.state.columns[columnId];
          const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </DragDropContext>
    );
  }
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);