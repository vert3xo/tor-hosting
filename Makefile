main:
	make -C web
	make -C server
	make -C electron
	make -C onion_utils
