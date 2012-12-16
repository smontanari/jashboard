module Jashboard
  class FSDBHelper
    def initialize(db_path)
      @db_path = db_path
    end

    def clean_data
      FileUtils.rm Dir.glob("#{@db_path}/monitor/..fsdb.meta.*.txt")
      FileUtils.rm Dir.glob("#{@db_path}/monitor/*.txt")
      FileUtils.rm Dir.glob("#{@db_path}/dashboard/..fsdb.meta.*.txt")
      FileUtils.rm Dir.glob("#{@db_path}/dashboard/*.txt")
    end

    def method_missing(method, args)
      match = method.to_s.match(/(serialize|verify)_(monitor|dashboard)/)
      super(method, args) if match.nil?
      self.send("#{match[1]}_yaml".to_sym, "#{match[2]}/#{args.id}.txt", args)
    end

    private

    def serialize_yaml(file_path, obj)
      File.open("#{@db_path}/#{file_path}", "w") do |f|
        f.write(YAML.dump(obj))
      end
    end

    def verify_yaml(file_path, obj)
      File.open("#{@db_path}/#{file_path}") do |f|
        f.read.should == obj.to_yaml
      end
    end
  end
end