require 'fsdb'
require 'uuidtools'
require 'yaml'
require 'model/dashboard'
require 'model/monitor'

module Jashboard
  class FileRepository
    DASHBOARD_NAMESPACE = "dashboard"
    MONITOR_NAMESPACE = "monitor"
    def initialize
      env = ENV['JASHBOARD_ENV'] || 'development'
      @db = FSDB::Database.new("db/#{env}")
    end

    def load_dashboards
      @db[DASHBOARD_NAMESPACE].map {|id| YAML.load(@db["#{DASHBOARD_NAMESPACE}/#{id}"])}
    end

    [DASHBOARD_NAMESPACE, MONITOR_NAMESPACE].each do |ns|
      define_method "load_#{ns}".to_sym do |id|
        YAML.load(@db["#{ns}/#{id}.txt"])
      end

      define_method "delete_#{ns}" do |id|
        @db.delete("#{ns}/#{id}.txt")
      end

      define_method "save_#{ns}" do |object|
        object.id = UUIDTools::UUID.random_create if (object.id.nil?)
        @db["#{ns}/#{object.id}.txt"] = YAML.dump(object)
        object
      end
    end
  end
end
