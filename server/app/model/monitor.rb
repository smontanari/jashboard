module Jashboard
  class Monitor
    attr_accessor :id, :type, :name, :refresh_interval, :position, :size, :configuration, :runtime_info

    def to_json(*args)
      map = {
        id: @id,
        name: @name,
        type: @type,
        refreshInterval: @refresh_interval,
        configuration: @configuration.to_map_with_camel_case_keys
      }
      map[:position] = @position unless @position.nil?
      map[:size] = @size unless @size.nil?
      map.to_json(*args)
    end
  end
end
