import React from 'react'
import ReactDOM from 'react-dom'
import 'reset-css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'

import initialData from './initial-data'
import Column from './column'

const Container = styled.div`
  display:flex;
`

class InnerList extends React.PureComponent {
  render() {
    const { column, taskMap, index } = this.props;
    //make copy of taskId array -> perform this function on each index
    const tasks = column.taskIds.map(taskId => taskMap[taskId]);
    //populate dynamic info
    return <Column column={column} tasks={tasks} index={index} />;
  }
}

class App extends React.Component {
  state = initialData

  onDragStart = (start, provided) => {
    provided.announce(console.log(`You have lifted the task in position ${start.source.index + 1}`),
    );
  };

  onDragUpdate = (update, provided) => {
    const message = update.destination
      ? console.log(`You have moved the task to position ${update.destination.index + 1}`)
      : console.log(`You are currently not over a droppable area`);

    provided.announce(message);
  };
  //only required callback
  onDragEnd = (result, provided) => {
    const message = result.destination
      ? `You have moved the task from position
          ${result.source.index + 1} to ${result.destination.index + 1}`
      : `The task has been returned to its starting position of
            ${result.source.index + 1}`;

    provided.announce(message);
    //info interested in from result object
    const { destination, source, draggableId, type } = result
    //if no destination -> nothing to do
    if (!destination) {
      return
    }
    //check if location of the draggable changed
    //user dropped item in same place where it started
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      //making copy of inital data columnOrder, updating column position
      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      };
      //new position persists
      this.setState(newState);
      return;
    }

    const start = this.state.columns[source.droppableId]
    const finish = this.state.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      }

      this.setState(newState)
      return
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }
    this.setState(newState)
  }

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {provided => (
            <Container
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {this.state.columnOrder.map((columnId, index) => {
                const column = this.state.columns[columnId]
                /* eslint-disable no-unused-vars */
                const tasks = column.taskIds.map(
                  taskId => this.state.tasks[taskId]
                );
                /* eslint-enable no-unused-vars */
                return (
                  <InnerList
                    key={column.id}
                    column={column}
                    taskMap={this.state.tasks}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)