SESSION_NAME="dev"
WINDOW_NAME="roguelike"
WORKING_DIR="$PWD"

tmux new-session -d -s $SESSION_NAME
tmux rename-window $WINDOW_NAME
tmux send-keys "cd $WORKING_DIR; webpack-dev-server" C-m

tmux split-window -v
tmux send-keys "cd $WORKING_DIR; explorer ." C-m

tmux split-window -h -t {top}
tmux send-keys "cd $WORKING_DIR; ./run_test_watch.sh" C-m

tmux attach -t $SESSION_NAME
